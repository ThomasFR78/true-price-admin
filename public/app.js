let offers = [];
let currentDropZone = null;

document.addEventListener('DOMContentLoaded', () => { loadOffers(); setupPasteHandlers(); });

async function loadOffers() {
      const response = await fetch('/api/offers');
      offers = await response.json();
      renderOffers();
}

function renderOffers() {
      const grid = document.getElementById('offersGrid');
      if (offers.length === 0) {
                grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><h3>No offers</h3><p>Click "New Offer" to start tracking</p></div>';
                return;
      }
      grid.innerHTML = offers.map(offer => `
          <div class="offer-card">
                  <div class="offer-header">
                              <div>
                                              <div class="offer-name">${escapeHtml(offer.name)}</div>
                                                              <div class="offer-badges">
                                                                                  <span class="offer-store">🏪 ${escapeHtml(offer.store || 'N/A')}</span>
                                                                                                      <span class="offer-region">${offer.region === 'europe' ? '🇪🇺' : '🌍'}</span>
                                                                                                                      </div>
                                                                                                                                      <div class="offer-price-badge">Ref: ${offer.displayed_price ? offer.displayed_price.toFixed(2) + '€' : 'N/A'}</div>
                                                                                                                                                  </div>
                                                                                                                                                              <div class="offer-menu">
                                                                                                                                                                              <button class="btn btn-secondary btn-sm" onclick="editOffer(${offer.id})">✏️</button>
                                                                                                                                                                                              <button class="btn btn-danger btn-sm" onclick="deleteOffer(${offer.id})">🗑️</button>
                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                          <a href="${escapeHtml(offer.url)}" target="_blank" class="offer-url">${escapeHtml(offer.url)}</a>
                                                                                                                                                                                                                                  <div class="offer-history-preview"><h4>Latest Checks</h4>${renderMiniHistory(offer)}</div>
                                                                                                                                                                                                                                          <div class="offer-actions">
                                                                                                                                                                                                                                                      <button class="btn btn-primary btn-sm" onclick="openCheckModal(${offer.id})">📊 New Check</button>
                                                                                                                                                                                                                                                                  <button class="btn btn-secondary btn-sm" onclick="showHistory(${offer.id})">📈 History</button>
                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                              </div>`).join('');
}

function renderMiniHistory(offer) {
      if (!offer.history || offer.history.length === 0) return '<div class="mini-history-empty">No checks</div>';
      return '<table class="mini-history-table"><thead><tr><th>Date</th><th>GG</th><th>AKS</th></tr></thead><tbody>' +
                offer.history.slice(0,3).map(c => `<tr><td>${new Date(c.check_date).toLocaleDateString()}</td><td>${c.price_ggdeals||'-'}</td><td>${c.price_allkeyshop||'-'}</td></tr>`).join('') + '</tbody></table>';
}

function openOfferModal(id=null) {
      resetScreenshotZone('Displayed');
      if(id) {
                const o = offers.find(x=>x.id===id);
                if(o) {
                              document.getElementById('offerModalTitle').textContent = 'Edit Offer';
                              document.getElementById('offerId').value = o.id;
                              document.getElementById('offerUrl').value = o.url;
                              document.getElementById('offerName').value = o.name;
                              document.getElementById('offerStore').value = o.store||'';
                              document.getElementById('offerRegion').value = o.region||'global';
                              document.getElementById('displayedPrice').value = o.displayed_price||'';
                }
      } else {
                document.getElementById('offerModalTitle').textContent = 'New Offer';
                document.getElementById('offerForm').reset();
                document.getElementById('offerId').value = '';
      }
      document.getElementById('offerModal').classList.add('active');
}

function closeOfferModal() { document.getElementById('offerModal').classList.remove('active'); }
function editOffer(id) { openOfferModal(id); }

async function saveOffer(e) {
      e.preventDefault();
      const id = document.getElementById('offerId').value;
      const data = {
                url: document.getElementById('offerUrl').value,
                name: document.getElementById('offerName').value,
                store: document.getElementById('offerStore').value,
                region: document.getElementById('offerRegion').value,
                displayed_price: parseFloat(document.getElementById('displayedPrice').value)||null,
                displayed_price_screenshot: document.getElementById('screenshotDisplayed').value||null,
                payment_method: document.querySelector('input[name="offerPaymentMethod"]:checked').value
      };
      await fetch(id?`/api/offers/${id}`:'/api/offers', {
                method: id?'PUT':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)
      });
      closeOfferModal(); loadOffers();
}

async function deleteOffer(id) {
      if(!confirm('Delete?')) return;
      await fetch(`/api/offers/${id}`,{method:'DELETE'}); loadOffers();
}

function openCheckModal(offerId) {
      document.getElementById('checkForm').reset();
      document.getElementById('checkOfferId').value = offerId;
      ['Paypal','Card','Ggdeals','Allkeyshop'].forEach(t=>resetScreenshotZone(t));
      document.getElementById('checkModal').classList.add('active');
}

function closeCheckModal() { document.getElementById('checkModal').classList.remove('active'); }

async function saveCheck(e) {
      e.preventDefault();
      const offerId = document.getElementById('checkOfferId').value;
      const data = {
                price_paypal: parseFloat(document.getElementById('pricePaypal').value)||null,
                price_card: parseFloat(document.getElementById('priceCard').value)||null,
                price_ggdeals: parseFloat(document.getElementById('priceGgdeals').value)||null,
                price_allkeyshop: parseFloat(document.getElementById('priceAllkeyshop').value)||null,
                coupon_ggdeals: document.getElementById('couponGgdeals').value||null,
                coupon_aks: document.getElementById('couponAllkeyshop').value||null,
                screenshot_paypal: document.getElementById('screenshotPaypal').value||null,
                screenshot_card: document.getElementById('screenshotCard').value||null,
                screenshot_ggdeals: document.getElementById('screenshotGgdeals').value||null,
                screenshot_allkeyshop: document.getElementById('screenshotAllkeyshop').value||null,
                notes: document.getElementById('checkNotes').value
      };
      await fetch(`/api/offers/${offerId}/checks`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      closeCheckModal(); loadOffers();
}

async function showHistory(offerId) {
      const offer = offers.find(o=>o.id===offerId);
      if(!offer) return;
      const checks = await(await fetch(`/api/offers/${offerId}/checks`)).json();
      document.getElementById('historyTitle').textContent = `History - ${offer.name}`;
      document.getElementById('historyContent').innerHTML = checks.length===0 ? '<div class="empty-state">No checks</div>' :
                checks.map(c=>`<div class="history-item"><div class="history-date">📅 ${new Date(c.check_date).toLocaleString()}</div>
                        <div>GGDeals: ${c.price_ggdeals||'-'}€ | AKS: ${c.price_allkeyshop||'-'}€</div>
                                ${c.notes?`<div class="history-notes">📝 ${escapeHtml(c.notes)}</div>`:''}
                                        <button class="btn btn-danger btn-sm" onclick="deleteCheck(${c.id},${offerId})">🗑️</button></div>`).join('');
      document.getElementById('historyModal').classList.add('active');
}

function closeHistoryModal() { document.getElementById('historyModal').classList.remove('active'); }

async function deleteCheck(checkId, offerId) {
      if(!confirm('Delete?')) return;
      await fetch(`/api/checks/${checkId}`,{method:'DELETE'}); showHistory(offerId);
}

function setupPasteHandlers() {
      ['Displayed','Paypal','Card','Ggdeals','Allkeyshop'].forEach(type => {
                const drop = document.getElementById('drop'+type);
                if(!drop) return;
                drop.addEventListener('click',()=>{currentDropZone=type;drop.focus();});
                drop.addEventListener('focus',()=>{currentDropZone=type;});
                drop.addEventListener('paste',handlePaste);
      });
}

async function handlePaste(e) {
      const items = e.clipboardData?.items;
      if(!items) return;
      for(const item of items) {
                if(item.type.startsWith('image/')) {
                              e.preventDefault();
                              const blob = item.getAsFile();
                              const reader = new FileReader();
                              reader.onload = async(ev)=>{
                                                const result = await(await fetch('/api/upload-base64',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:ev.target.result})})).json();
                                                if(result.path && currentDropZone) setScreenshotPreview(currentDropZone,result.path);
                              };
                              reader.readAsDataURL(blob);
                              break;
                }
      }
}

function setScreenshotPreview(type,path) {
      const drop=document.getElementById('drop'+type), preview=document.getElementById('preview'+type), input=document.getElementById('screenshot'+type);
      if(drop&&preview&&input) {drop.classList.add('has-image');preview.src=path;input.value=path;}
}

function resetScreenshotZone(type) {
      const drop=document.getElementById('drop'+type), preview=document.getElementById('preview'+type), input=document.getElementById('screenshot'+type);
      if(drop&&preview&&input) {drop.classList.remove('has-image');preview.src='';input.value='';}
}

function escapeHtml(text) { const div=document.createElement('div');div.textContent=text;return div.innerHTML; }
