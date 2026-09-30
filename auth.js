// Stacknity Technologies - authentication (Supabase Auth, email + password)
// Shared Stacknity group auth project. The anon key below is a public client key - safe to expose;
// access is governed by Supabase Auth.
var STACKNITY_SUPABASE_URL = 'https://vwmqhqasyxmuizgwjmrt.supabase.co';
var STACKNITY_SUPABASE_ANON_KEY = 'sb_publishable_U61MK2hrJ8-La8TFyuUPYA_qo1jBVUI';

(function(){
  if(!window.supabase){return;}
  var client = window.supabase.createClient(STACKNITY_SUPABASE_URL, STACKNITY_SUPABASE_ANON_KEY);
  window.stacknityTechAuth = client;

  function status(id, kind, msg){
    var el=document.getElementById(id);
    if(el){el.className='form-status '+kind;el.textContent=msg;}
  }

  // ---- signup ----
  var su=document.getElementById('signup-form');
  if(su){
    su.addEventListener('submit',function(e){
      e.preventDefault();
      var name=document.getElementById('su-name').value.trim();
      var email=document.getElementById('su-email').value.trim();
      var pass=document.getElementById('su-pass').value;
      var btn=su.querySelector('button[type=submit]');
      btn.disabled=true;btn.textContent='Creating account...';
      client.auth.signUp({
        email:email,
        password:pass,
        options:{data:{full_name:name},emailRedirectTo:window.location.origin+window.location.pathname.replace(/[^/]*$/,'')+'login.html'}
      }).then(function(res){
        btn.disabled=false;btn.textContent='Create account';
        if(res.error){status('su-status','err',res.error.message);return;}
        status('su-status','ok','Account created. We sent a confirmation link to '+email+' - open it to activate your login, then sign in.');
        su.reset();
      }).catch(function(){btn.disabled=false;btn.textContent='Create account';status('su-status','err','Network error. Please try again.');});
    });
  }

  // ---- login ----
  var li=document.getElementById('login-form');
  if(li){
    li.addEventListener('submit',function(e){
      e.preventDefault();
      var email=document.getElementById('li-email').value.trim();
      var pass=document.getElementById('li-pass').value;
      var btn=li.querySelector('button[type=submit]');
      btn.disabled=true;btn.textContent='Signing in...';
      client.auth.signInWithPassword({email:email,password:pass}).then(function(res){
        if(res.error){btn.disabled=false;btn.textContent='Sign in';status('li-status','err',res.error.message);return;}
        window.location.href='dashboard.html';
      }).catch(function(){btn.disabled=false;btn.textContent='Sign in';status('li-status','err','Network error. Please try again.');});
    });
  }

  // ---- dashboard guard + content ----
  var dash=document.getElementById('dash-app');
  if(dash){
    client.auth.getSession().then(function(res){
      var session=res.data&&res.data.session;
      if(!session){window.location.href='login.html';return;}
      var user=session.user||{};
      var name=(user.user_metadata&&user.user_metadata.full_name)||'';
      var email=user.email||'';
      document.getElementById('dash-loading').style.display='none';
      dash.style.display='block';
      var greeting=document.getElementById('dash-greeting');
      if(greeting){greeting.textContent=name?('Welcome, '+name):('Welcome back');}
      var emailEl=document.getElementById('dash-email');
      if(emailEl){emailEl.textContent=email;}
      var since=document.getElementById('dash-since');
      if(since&&user.created_at){
        var d=new Date(user.created_at);
        since.textContent=d.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
      }
      var out=document.getElementById('dash-signout');
      if(out){out.addEventListener('click',function(){client.auth.signOut().then(function(){window.location.href='index.html';});});}
    });
  }
})();
