(() => {
'use strict';
const filename=new URLSearchParams(location.search).get('paper');
const paper=window.marioPublications.find(p=>p.pdf.split('/').pop()===filename);
const title=document.getElementById('paper-title'),status=document.getElementById('download-status');
if(!paper){title.textContent='Paper not found';status.textContent='Return to the publication list to select a paper.';return;}
title.textContent=paper.title;
document.title='Download PDF · '+paper.title;
const save=document.getElementById('save-pdf'),open=document.getElementById('open-pdf');
save.href=paper.pdf;save.download=filename;open.href=paper.pdf;
document.getElementById('download-options').hidden=false;
status.textContent='Your PDF is ready. If the download does not start, choose Save PDF. You can also open the paper and save it from your browser’s PDF viewer.';
// A separate top-level page provides an explicit fallback for embedded browsers.
if(window.self===window.top) save.click();
})();
