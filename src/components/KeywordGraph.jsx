import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function KeywordGraph({ posts, keywordFrequency }) {
  const ref = useRef();

  useEffect(() => {
    const width = 400;
    const height = 300;
    const keywords = Object.keys(keywordFrequency).map(k => ({ id: k, count: keywordFrequency[k] }));
    const nodes = keywords.concat(posts.map(p => ({ id: p.slug, title: p.title })));
    const links = [];
    posts.forEach(p => {
      (p.keywords || []).forEach(k => {
        links.push({ source: k, target: p.slug });
      });
    });

    const svg = d3.select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    svg.selectAll('*').remove();
    const link = svg.append('g').selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999');

    const node = svg.append('g').selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', d => d.count ? 10 + d.count * 2 : 8)
      .attr('fill', d => d.count ? '#3182bd' : '#aaa')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    const label = svg.append('g').selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text(d => d.title || d.id)
      .attr('font-size', 10);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [posts, keywordFrequency]);

  return (
    <svg ref={ref} className="w-full h-80 border" />
  );
}
