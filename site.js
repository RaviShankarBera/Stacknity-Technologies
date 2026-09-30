// Stacknity Technologies - shared site behaviour
(function(){
  // Keep the browser icon aligned with the white and blue theme.
  var favicon=document.querySelector('link[rel="icon"]');
  if(favicon){favicon.href=favicon.href.replace(/%23060a08/g,'%23ffffff').replace(/%236fffb4/g,'%23185adb');}

  // nav scroll state
  var nav=document.getElementById('nav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>40);},{passive:true});}

  // mobile menu
  var toggle=document.getElementById('nav-toggle'),menu=document.getElementById('mobile-menu');
  if(toggle&&menu){
    toggle.addEventListener('click',function(){
      var open=menu.classList.toggle('open');
      toggle.classList.toggle('open',open);
      document.body.style.overflow=open?'hidden':'';
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){menu.classList.remove('open');toggle.classList.remove('open');document.body.style.overflow='';});
    });
  }

  // reveal on scroll
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});}
  else{document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});}
  // fallback: if IO never fires (odd environments), still show content
  setTimeout(function(){
    document.querySelectorAll('.reveal:not(.in)').forEach(function(el){el.classList.add('in');});
    document.querySelectorAll('[data-count]:not(.counted)').forEach(function(el){
      el.classList.add('counted');
      el.textContent=el.getAttribute('data-count')+(el.getAttribute('data-suffix')||'');
    });
  },1500);

  // marquee: duplicate track for seamless loop
  var mq=document.getElementById('marquee-track');
  if(mq){mq.innerHTML+=mq.innerHTML;}

  // animated stat counters
  var counters=document.querySelectorAll('[data-count]');
  if(counters.length){
    var cio=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting){return;}
        cio.unobserve(e.target);
        var el=e.target,target=parseInt(el.getAttribute('data-count'),10),suffix=el.getAttribute('data-suffix')||'';
        el.classList.add('counted');
        if(reduced){el.textContent=target+suffix;return;}
        var start=null,dur=1600;
        function step(ts){
          if(!start){start=ts;}
          var p=Math.min((ts-start)/dur,1);
          var eased=1-Math.pow(1-p,3);
          el.textContent=Math.round(target*eased)+suffix;
          if(p<1){requestAnimationFrame(step);}
        }
        requestAnimationFrame(step);
      });
    },{threshold:.4});
    if(!reduced){counters.forEach(function(el){cio.observe(el);});}
    else{counters.forEach(function(el){el.classList.add('counted');el.textContent=el.getAttribute('data-count')+(el.getAttribute('data-suffix')||'');});}
  }

  // spotlight reveal (cursor on desktop, slow drift on touch)
  var hv=document.getElementById('hero-visual');
  if(hv){
    var reveal=hv.querySelector('.spot-reveal');
    var fine=window.matchMedia('(pointer:fine)').matches;
    var tx=50,ty=42,cx=50,cy=42,t=0;
    hv.addEventListener('mousemove',function(e){
      var b=hv.getBoundingClientRect();
      tx=(e.clientX-b.left)/b.width*100;
      ty=(e.clientY-b.top)/b.height*100;
    });
    if(reduced&&reveal){reveal.style.setProperty('--mx','50%');reveal.style.setProperty('--my','42%');}
    if(!reduced)(function loop(){
      if(!fine){t+=0.008;tx=50+Math.sin(t*1.35)*27;ty=44+Math.cos(t*0.95)*21;}
      cx+=(tx-cx)*0.12;cy+=(ty-cy)*0.12;
      if(reveal){reveal.style.setProperty('--mx',cx+'%');reveal.style.setProperty('--my',cy+'%');}
      requestAnimationFrame(loop);
    })();
    // gentle scroll parallax on the visual
    var hero=document.querySelector('.hero');
    if(hero){
      window.addEventListener('scroll',function(){
        var y=window.scrollY;
        if(y<window.innerHeight){hv.style.transform='translateY('+(y*0.07)+'px)';}
      },{passive:true});
    }
  }

  // 3D tilt on cards
  document.querySelectorAll('.svc,.dash-link,.stat').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var b=card.getBoundingClientRect();
      var rx=((e.clientY-b.top)/b.height-.5)*-6,ry=((e.clientX-b.left)/b.width-.5)*8;
      card.style.transform='perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave',function(){card.style.transform='';});
  });

  // contact form -> mailto compose
  var cf=document.getElementById('contact-form');
  if(cf){
    cf.addEventListener('submit',function(e){
      e.preventDefault();
      var name=document.getElementById('cf-name').value.trim();
      var company=document.getElementById('cf-company').value.trim();
      var email=document.getElementById('cf-email').value.trim();
      var need=document.getElementById('cf-need');
      var msg=document.getElementById('cf-msg').value.trim();
      var subject='Project enquiry from '+name+(company?' ('+company+')':'');
      var body='Name: '+name+'\nCompany: '+(company||'-')+'\nEmail: '+email+'\nInterested in: '+(need?need.value:'-')+'\n\nProject details:\n'+msg;
      window.location.href='mailto:Stacknity.Technologies@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    });
  }

  // footer year
  var yr=document.getElementById('year');
  if(yr){yr.textContent=new Date().getFullYear();}
})();
