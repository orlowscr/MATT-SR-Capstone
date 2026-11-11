import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import { EvaluationService } from './evaluation.service';

interface WheelDatum { name: string; id: string; type: 'root' | 'core' | 'task' | 'measure'; children?: WheelDatum[]; value?: number; }
@Component({selector:'app-wheel',standalone:true,template:`
<section class="page-heading"><div><span class="eyebrow">ASSESSMENT OVERVIEW</span><h1>Core Task Wheel</h1><p>Click a segment to drill in. Click a measure to open its evaluation.</p></div></section>
<div class="wheel-toolbar panel"><button class="button outline" (click)="back()" [disabled]="path.length===1">← Back</button><button class="button outline" (click)="reset()" [disabled]="path.length===1">Reset view</button>
<span class="muted">Viewing: <strong>{{currentName()}}</strong></span><label>Team <select (change)="draw()" #teamSelect><option value="team-alpha">Demo Team Alpha</option><option value="team-beta">Demo Team Beta</option></select></label></div>
<div class="wheel-layout"><section class="panel chart-panel"><div #chart class="chart" role="img" aria-label="Interactive hierarchical assessment wheel"></div></section>
<aside class="panel legend"><h2>How to use</h2><p>Core tasks contain tasks, which contain individual measures.</p><p><span class="swatch" style="background:#50b8d6"></span> Core task</p><p><span class="swatch" style="background:#94a3b8"></span> Task</p><p><span class="swatch" style="background:#cbd5e1"></span> Measure</p><p>Click a measure to open its assessment form. The Back button returns one level; Reset jumps to the full wheel.</p><div class="guidance"><strong>Selected</strong><p>{{selectedInfo()}}</p></div></aside></div>
`})
export class WheelComponent implements AfterViewInit, OnDestroy {
  readonly api = inject(EvaluationService); private readonly router = inject(Router);
  @ViewChild('chart') chart!: ElementRef<HTMLDivElement>;
  @ViewChild('teamSelect') teamSelect!: ElementRef<HTMLSelectElement>;
  readonly currentName = signal('Demo Exercise');
  readonly selectedInfo = signal('Click a segment to explore.');
  readonly root: WheelDatum = { name:'Demo Exercise', id:'root', type:'root', children: this.api.coreTasks.map(c => ({
    id:c.id, name:c.name, type:'core' as const, children:c.tasks.map(t => ({ id:t.id, name:t.code, type:'task' as const,
      children:this.api.measures.filter(m => m.taskId === t.id).map(m => ({id:m.id,name:m.code,type:'measure' as const,value:1}))
    }))
  })) };
  path: WheelDatum[] = [this.root];
  private resize?: ResizeObserver;
  ngAfterViewInit() { this.draw(); if (typeof ResizeObserver !== 'undefined') { this.resize = new ResizeObserver(() => this.draw()); this.resize.observe(this.chart.nativeElement); } }
  ngOnDestroy() { this.resize?.disconnect(); }
  reset() { this.path = [this.root]; this.update(); }
  back() { if (this.path.length > 1) { this.path.pop(); this.update(); } }
  private update() { this.currentName.set(this.path[this.path.length-1].name); this.draw(); }
  private enter(d: WheelDatum) {
    if (d.type === 'measure') {
      this.router.navigate(['/assess'], {queryParams: {measure:d.id, team:this.teamSelect.nativeElement.value}});
      return;
    }
    this.path.push(d); this.selectedInfo.set(`${d.name} selected. Use Back to return.`); this.update();
  }
  draw() {
    if (!this.chart) return;
    const el=this.chart.nativeElement; el.replaceChildren();
    const width = Math.max(320, Math.min(el.clientWidth || 700, 760)); const size=width; const radius=size/2-18;
    const root = d3.hierarchy<WheelDatum>(this.path[this.path.length-1]).sum(d => d.value || 0) as d3.HierarchyRectangularNode<WheelDatum>;
    d3.partition<WheelDatum>().size([2 * Math.PI, radius])(root);
    const svg=d3.select(el).append('svg').attr('viewBox',`0 0 ${size} ${size}`).attr('width','100%').attr('aria-label','Assessment wheel');
    const g=svg.append('g').attr('transform',`translate(${size/2},${size/2})`);
    const arc=d3.arc<d3.HierarchyRectangularNode<WheelDatum>>().startAngle(d=>d.x0).endAngle(d=>d.x1).padAngle(0.008).padRadius(radius/2)
      .innerRadius(d=>d.y0===0?0:d.y0*0.90).outerRadius(d=>Math.max(d.y0*0.90+1,d.y1*0.90-2));
    const colors: Record<string,string>={root:'#10234b',core:'#50b8d6',task:'#94a3b8',measure:'#cbd5e1'};
    const nodes=g.selectAll<SVGPathElement,d3.HierarchyRectangularNode<WheelDatum>>('path').data(root.descendants()).join('path')
      .attr('d',arc).attr('fill',d=>colors[d.data.type]).attr('stroke','#fff').attr('stroke-width',1.5)
      .style('cursor','pointer').on('click',(_,d)=>this.enter(d.data));
    nodes.append('title').text(d=>`${d.data.name} — click to ${d.data.type==='measure'?'evaluate':'zoom'}`);
    g.selectAll<SVGTextElement,d3.HierarchyRectangularNode<WheelDatum>>('text.segment').data(root.descendants().filter(d=>d.depth>0 && d.x1-d.x0>0.20))
      .join('text').attr('class','segment').attr('pointer-events','none').attr('text-anchor','middle').attr('font-size',12).attr('fill','#10213d')
      .attr('transform',d=>{const a=(d.x0+d.x1)/2-Math.PI/2;const r=(d.y0+d.y1)*0.45;return `translate(${Math.cos(a)*r},${Math.sin(a)*r}) rotate(${(a*180/Math.PI)+90})`;})
      .text(d=>d.data.name.length>15?d.data.name.slice(0,13)+'…':d.data.name);
  }
}
