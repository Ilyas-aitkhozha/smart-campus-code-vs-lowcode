import SC from '../SlotChecker.jsobject.js';
const snap = JSON.stringify(SC.bookings);
const cases = [['T1','12:00','60',false,'OK'],['T2','10:30','60',false,'OVERLAP'],['T3','12:00','60',true,'ROOM_BLOCKED'],['T4','12:00','0',false,'DURATION_TOO_SHORT'],['T5','12:00','121',false,'DURATION_TOO_LONG'],['T6','08:00','30',false,'IN_THE_PAST'],['T7','11:00','60',false,'OK'],['X1','<b>x</b>','60',false,'INVALID_START_TIME'],['X2','12:00','',false,'INVALID_DURATION'],['X3','16:00','120',false,'OK'],['X4','13:00','60',false,'OK']];
let ok=0; for (const [id,s,d,b,exp] of cases){ const got=SC.decide(s,d,b); console.log(id, got, got===exp?'PASS':'FAIL'); if(got===exp) ok++; }
console.log('T8 bookings unchanged:', JSON.stringify(SC.bookings)===snap); console.log(`${ok}/${cases.length}`);
