document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.menu-toggle');
  const links=document.querySelector('.nav-links');
  if(toggle&&links){toggle.addEventListener('click',()=>{
    const open=links.dataset.open==='1';
    links.dataset.open=open?'0':'1';
    Object.assign(links.style,open?{}:{display:'flex',position:'absolute',top:'68px',left:'0',right:'0',background:'#0b0b0b',padding:'20px',flexDirection:'column',alignItems:'flex-start',borderTop:'1px solid #252525'});
    if(open) links.removeAttribute('style');
  })}
  document.querySelectorAll('form[data-mailto]').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const fd=new FormData(form); const lines=[];
      for(const [k,v] of fd.entries()){ if(v) lines.push(`${k}: ${v}`); }
      const subject=form.dataset.subject||'Website inquiry - SJ Engineering & Constructions';
      const to=form.dataset.mailto;
      window.location.href=`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    });
  });
});
