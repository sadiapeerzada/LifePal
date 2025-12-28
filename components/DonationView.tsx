
import React, { useState, useEffect } from 'react';
import { MOCK_CAMPAIGNS } from '../constants';
import { HandHeart, Zap, ArrowRight, Heart, Users2, ShieldCheck, ExternalLink, X, CheckCircle2, Loader2, Lock, History, Sparkles, Receipt, Activity } from 'lucide-react';
import { Campaign, DonationRecord } from '../types';

interface Props {
  onDonationSuccess: (record: DonationRecord) => void;
  donationHistory: DonationRecord[];
}

const DonationView: React.FC<Props> = ({ onDonationSuccess, donationHistory }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [step, setStep] = useState<'AMOUNT' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS'>('AMOUNT');
  const [amount, setAmount] = useState<number>(1000);
  const [recentGifts, setRecentGifts] = useState<{name: string, amount: number}[]>([]);

  useEffect(() => {
    // Wall of Kindness logic
    const names = ["Aman K.", "Dr. Shariq", "Zoya F.", "Alig Alumnus", "Anonymous Hero", "Sameer R."];
    const initial = names.map(n => ({ name: n, amount: Math.floor(Math.random() * 5000) + 100 }));
    setRecentGifts(initial);

    const interval = setInterval(() => {
      const newGift = { name: names[Math.floor(Math.random() * names.length)], amount: Math.floor(Math.random() * 2000) + 500 };
      setRecentGifts(prev => [newGift, ...prev.slice(0, 4)]);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handlePay = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      if (selectedCampaign) {
        const record: DonationRecord = {
          id: `TRX_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          campaignId: selectedCampaign.id,
          campaignTitle: selectedCampaign.title,
          amount,
          timestamp: Date.now(),
          status: 'SUCCESS'
        };
        onDonationSuccess(record);
        setStep('SUCCESS');
      }
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700 text-left pb-32">
      <header className="space-y-6 text-center py-12 relative">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 rounded-full font-black text-[10px] uppercase tracking-[0.25em] shadow-inner mb-4">
           <Zap className="w-4 h-4" /> Zero Platform Fees • Direct Hospital Treasury Settlement
        </div>
        <h1 className="text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]">Support Circle.</h1>
        <p className="text-slate-500 dark:text-slate-400 text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
          LifePal ensures 100% of your gift reaches the patient's hospital ledger. Verified by Alig Care & JNMCH.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {MOCK_CAMPAIGNS.map(campaign => {
              const recentActivity = Math.floor(campaign.donationsCount * 0.12) + 1;
              return (
              <div key={campaign.id} className="bg-white dark:bg-slate-900 rounded-[4rem] overflow-hidden border-2 border-slate-50 dark:border-slate-800 shadow-xl flex flex-col group hover:-translate-y-2 transition-all relative">
                <div className="h-64 bg-slate-100 relative overflow-hidden">
                   <img src={campaign.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={campaign.title} />
                   <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-emerald-600 shadow-lg flex items-center gap-2 border border-emerald-100">
                     <ShieldCheck className="w-3.5 h-3.5" /> JNMCH Verified • {campaign.category}
                   </div>
                </div>
                <div className="p-10 flex-1 flex flex-col space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-blue-950 dark:text-white leading-tight group-hover:text-emerald-600 transition-colors">{campaign.title}</h3>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <Users2 className="w-3.5 h-3.5" /> {campaign.patientName}
                    </p>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium line-clamp-4 leading-relaxed italic border-l-4 border-slate-100 dark:border-slate-800 pl-6">"{campaign.story}"</p>
                  
                  <div className="space-y-4 pt-4 mt-auto">
                     <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Raised by Alig Care</p>
                          <p className="text-3xl font-black text-emerald-600">₹{campaign.raisedAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Requirement</p>
                          <p className="text-lg font-black text-blue-950 dark:text-white">₹{campaign.targetAmount.toLocaleString()}</p>
                        </div>
                     </div>
                     <div className="w-full h-3 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 p-0.5">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${(campaign.raisedAmount / campaign.targetAmount) * 100}%` }} />
                     </div>
                     
                     {/* Transparency Micro-update */}
                     <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                           <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                           {recentActivity} Kind Souls Joined Recently
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{campaign.donationsCount} Total Gifts</span>
                     </div>
                  </div>

                  <button 
                    onClick={() => { setSelectedCampaign(campaign); setStep('AMOUNT'); }}
                    className="w-full py-6 bg-blue-950 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-slate-100 dark:shadow-none hover:bg-black transition-all flex items-center justify-center gap-4 group"
                  >
                    Donate Now <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            )})}
          </div>
        </div>

        <div className="space-y-12">
           <section className="bg-slate-950 text-white p-10 rounded-[4rem] shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-emerald-600 rounded-3xl text-white shadow-xl"><Sparkles className="w-8 h-8" /></div>
                 <h2 className="text-3xl font-black tracking-tight">Wall of Kindness</h2>
              </div>
              <div className="space-y-6">
                 {recentGifts.map((gift, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-[1.8rem] border border-white/5 animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 150}ms` }}>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black text-xs uppercase">{gift.name[0]}</div>
                          <p className="font-bold text-slate-300">{gift.name}</p>
                       </div>
                       <p className="font-black text-emerald-400">₹{gift.amount.toLocaleString()}</p>
                    </div>
                 ))}
              </div>
           </section>

           <section className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl space-y-8">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-3xl text-blue-600 dark:text-blue-400 shadow-sm"><History className="w-8 h-8" /></div>
                 <h2 className="text-3xl font-black text-blue-950 dark:text-white">Your Impact</h2>
              </div>
              {donationHistory.length === 0 ? (
                 <div className="text-center py-10 text-slate-300 dark:text-slate-600 font-bold italic">No gifts yet. Start your journey today.</div>
              ) : (
                 <div className="space-y-4">
                    {donationHistory.map(record => (
                       <div key={record.id} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl space-y-3 group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <div className="flex justify-between items-start">
                             <h4 className="font-black text-slate-800 dark:text-white text-sm line-clamp-1 flex-1">{record.campaignTitle}</h4>
                             <p className="font-black text-blue-600 dark:text-blue-400">₹{record.amount.toLocaleString()}</p>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
                             <span>{new Date(record.timestamp).toLocaleDateString()}</span>
                             <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> {record.id}</span>
                          </div>
                       </div>
                    ))}
                    <button className="w-full py-4 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2">
                       <Receipt className="w-4 h-4" /> Download Yearly Receipt
                    </button>
                 </div>
              )}
           </section>
        </div>
      </div>

      {/* Donation Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedCampaign(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border-4 border-white/20">
             <div className="p-8 bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Heart className="w-6 h-6 fill-current" /></div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white">Verified Support</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase truncate max-w-[200px]">{selectedCampaign.patientName}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCampaign(null)} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
             </div>

             <div className="p-10 space-y-10 bg-white dark:bg-slate-900">
               {step === 'AMOUNT' && (
                 <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                   <div className="grid grid-cols-2 gap-4">
                      {[1000, 2000, 5000, 10000].map(amt => (
                        <button 
                          key={amt}
                          onClick={() => setAmount(amt)}
                          className={`py-6 rounded-[2.5rem] font-black text-2xl border-4 transition-all ${amount === amt ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xl shadow-emerald-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-emerald-200'}`}
                        >
                          ₹{amt.toLocaleString()}
                        </button>
                      ))}
                   </div>
                   <div className="relative">
                      <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 font-black text-2xl">₹</span>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full pl-14 pr-8 py-8 bg-slate-50 dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 rounded-[3rem] outline-none focus:border-emerald-400 font-black text-3xl transition-all text-slate-900 dark:text-white"
                        placeholder="Other amount"
                      />
                   </div>
                   <button 
                    onClick={() => setStep('PAYMENT')}
                    className="w-full py-8 bg-emerald-600 text-white rounded-[3rem] font-black text-2xl shadow-2xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all flex items-center justify-center gap-4"
                   >
                     Confirm Gift <ArrowRight className="w-8 h-8" />
                   </button>
                 </div>
               )}

               {step === 'PAYMENT' && (
                 <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Select Gateway</h3>
                   <div className="space-y-3">
                      <PaymentButton name="UPI (GPay / PhonePe)" icon="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" selected />
                      <PaymentButton name="Razorpay" icon="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" />
                   </div>
                   <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-700 space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold text-slate-500 uppercase tracking-widest">
                        <span>Contribution</span>
                        <span className="text-slate-900 dark:text-white text-xl font-black">₹{amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-emerald-600 pt-4 mt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-600">
                        <span>Platform Fee</span>
                        <span className="font-black tracking-[0.2em]">0.0% (LIFE PAL PROMISE)</span>
                      </div>
                   </div>
                   <button 
                    onClick={handlePay}
                    className="w-full py-8 bg-slate-950 text-white rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4"
                   >
                     <Lock className="w-6 h-6 text-emerald-500" /> Secure Checkout
                   </button>
                 </div>
               )}

               {step === 'PROCESSING' && (
                 <div className="text-center py-20 space-y-8 animate-in fade-in duration-500">
                    <div className="relative mx-auto w-32 h-32">
                       <div className="absolute inset-0 border-8 border-slate-100 dark:border-slate-800 rounded-full" />
                       <div className="absolute inset-0 border-8 border-t-emerald-600 rounded-full animate-spin" />
                       <div className="absolute inset-0 flex items-center justify-center"><HandHeart className="w-12 h-12 text-emerald-600" /></div>
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-3xl font-black text-slate-900 dark:text-white">Verifying Transaction</h3>
                       <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-[320px] mx-auto">Connecting to Alig Care's Hospital Treasury Settlement Layer...</p>
                    </div>
                 </div>
               )}

               {step === 'SUCCESS' && (
                 <div className="text-center py-10 space-y-12 animate-in zoom-in-95 duration-500">
                    <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-100 dark:shadow-none scale-110">
                       <CheckCircle2 className="w-16 h-16 text-emerald-600" />
                    </div>
                    <div className="space-y-4">
                       <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Impact Logged.</h2>
                       <p className="text-2xl text-slate-500 dark:text-slate-400 font-medium px-4 leading-relaxed">
                         Your verified gift of <strong>₹{amount.toLocaleString()}</strong> has been credited to the hospital ledger.
                       </p>
                    </div>
                    <div className="p-8 bg-slate-950 rounded-[3rem] text-left border-4 border-slate-900 space-y-4">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-emerald-500 rounded-xl"><Lock className="w-4 h-4 text-white" /></div>
                         <p className="text-xs font-black text-white uppercase tracking-widest">Transaction Verified</p>
                       </div>
                       <p className="font-mono text-xs text-emerald-400">{`LP_TRX_${Math.random().toString(36).substr(2, 9).toUpperCase()}`}</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed pt-2">Funds are held by AMU Treasurer and disbursed against hospital invoices only.</p>
                    </div>
                    <button 
                      onClick={() => setSelectedCampaign(null)}
                      className="w-full py-8 bg-slate-900 text-white rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-black transition-all"
                    >
                      Return to Dashboard
                    </button>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentButton = ({ name, icon, selected }: any) => (
  <button className={`w-full p-8 rounded-[2.5rem] border-4 flex items-center justify-between transition-all ${selected ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 bg-white dark:bg-slate-800'}`}>
    <div className="flex items-center gap-6">
      <img src={icon} className="h-8" alt={name} />
      <span className="font-black text-slate-800 dark:text-white text-2xl tracking-tight">{name}</span>
    </div>
    {selected && <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
  </button>
);

export default DonationView;
