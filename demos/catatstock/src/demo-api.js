// Isolated, in-memory showcase adapter. Never connects to production services.
let products = [
 {id:1,name:'Telur Ayam',category:'Telur',image_emoji:'🥚',price_buy:2400,price_sell:3000,stock:120,product_code:'DEMO001'},
 {id:2,name:'Beras Premium 5kg',category:'Beras',image_emoji:'🍚',price_buy:62000,price_sell:72000,stock:40,product_code:'DEMO002'},
 {id:3,name:'Minyak Goreng 2L',category:'Minyak',image_emoji:'🛢️',price_buy:29000,price_sell:34000,stock:24,product_code:'DEMO003'},
 {id:4,name:'Gula Pasir 1kg',category:'Gula',image_emoji:'🍬',price_buy:14000,price_sell:17000,stock:65,product_code:'DEMO004'},
];
let transactions = products.map((p,i)=>({id:i+1,product_id:p.id,product_name:p.name,type:'out',quantity:5+i,total_price:p.price_sell*(5+i),created_at:new Date().toISOString(),user_name:'Demo visitor'}));
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
export async function demoFetch(url, options={}) {
 const path=new URL(url,'https://demo.invalid').pathname;
 const method=options.method||'GET';
 const body=typeof options.body==='string'?JSON.parse(options.body):{};
 if(path==='/products'&&method==='GET')return reply(products);
 if(path==='/products'&&method==='POST'){
  if(!body.name?.trim()||!Number.isFinite(body.stock)||body.stock<0)return reply({error:'Nama dan stok valid diperlukan'},400);
  products.push({...body,id:Math.max(0,...products.map(p=>p.id))+1});return reply({success:true});
 }
 if(path.startsWith('/products/')){
  const id=Number(path.split('/')[2]);const p=products.find(p=>p.id===id);
  if(!p)return reply({error:'Produk tidak ditemukan'},404);
  if(method==='DELETE')products=products.filter(p=>p.id!==id);
  else if(method==='PUT'){if(body.stock<0)return reply({error:'Stok tidak valid'},400);Object.assign(p,body);}
  return reply({success:true});
 }
 if(path==='/transactions'&&method==='GET')return reply(transactions);
 if(path==='/transactions'&&method==='POST'){
  const p=products.find(p=>p.id===body.product_id);const q=body.quantity;
  if(!p||!Number.isInteger(q)||q<=0||!['in','out'].includes(body.type))return reply({error:'Transaksi tidak valid'},400);
  if(body.type==='out'&&q>p.stock)return reply({error:'Stok tidak cukup'},400);
  p.stock+=body.type==='in'?q:-q;
  transactions.unshift({...body,id:transactions.length+1,product_name:p.name,total_price:q*(body.type==='in'?p.price_buy:p.price_sell),created_at:new Date().toISOString(),user_name:'Demo visitor'});
  return reply({success:true,transaction:transactions[0],id:transactions[0].id,product_name:p.name});
 }
 if(path==='/reports/profit_today')return reply({profit:transactions.filter(t=>t.type==='out').reduce((sum,t)=>sum+t.quantity*((products.find(p=>p.id===t.product_id)?.price_sell||0)-(products.find(p=>p.id===t.product_id)?.price_buy||0)),0),revenue:transactions.filter(t=>t.type==='out').reduce((sum,t)=>sum+t.total_price,0)});
 if(path==='/predict')return reply({error:'AI forecasting is not connected in this sample-data demo.'},503);
 return reply({error:'This feature is not available in the browser showcase.'},400);
}
