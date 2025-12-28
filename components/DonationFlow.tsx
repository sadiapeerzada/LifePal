
import React, { useState } from 'react';
import { Campaign } from '../types';
import { 
  X, 
  ChevronRight, 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  Wallet, 
  CreditCard, 
  Smartphone,
  Globe,
  Info,
  ExternalLink,
  Lock
} from 'lucide-react';

interface Props {
  campaign: Campaign;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

type Step = 'AMOUNT' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS';

const DonationFlow: React.FC<Props> = ({ campaign, onClose, onSuccess }) => {
  const [step, setStep] = useState<Step>('AMOUNT');
  const [amount, setAmount] = useState<number>(1000);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleProceedToPayment = () => {
    setStep('PAYMENT');
  };

  const handleRazorpayCheckout = () => {
    setPaymentLoading(true);
    setStep('PROCESSING');
    
    // Simulate Razorpay secure redirect and callback
    setTimeout(() => {
      setPaymentLoading(false);
      setStep('SUCCESS');
      onSuccess(amount);
    }, 2500);
  };

  const fastAmounts = [500, 1000, 5000, 10000];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-8 border-b flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Support Patient</h3>
              <p className="text-sm text-slate-500 font-bold truncate max-w-[200px]">{campaign.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          {step === 'AMOUNT' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                  <span>Choose Amount (₹)</span>
                  <span className="text-blue-600 font-bold text-[10px]">Min. ₹100</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {fastAmounts.map(amt => (
                    <button 
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className={`py-4 rounded-2xl font-black text-xl border-2 transition-all ${amount === amt ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'}`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-400 font-black text-xl transition-all"
                    placeholder="Other Amount"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex gap-4">
                <Info className="w-6 h-6 text-blue-500 shrink-0" />
                <p className="text-sm text-blue-700 font-medium leading-relaxed">
                  Your contribution goes to <strong>Alig Care Funds</strong>. We settle invoices directly with the JNMCH Billing Dept.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border">
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-slate-800">Donate Anonymously</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Hide name from donor lists</p>
                </div>
                <button 
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-12 h-6 rounded-full transition-all relative ${isAnonymous ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAnonymous ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <button 
                onClick={handleProceedToPayment}
                className="w-full py-5 bg-blue-600 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-blue-100 hover:bg-blue-700 flex items-center justify-center gap-3 transition-all"
              >
                Proceed to Payment <ChevronRight className="w-6 h-6" />
              </button>

              <div className="text-center pt-2">
                <a 
                  href="https://www.aligscare.org/donate" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                  View Official Alig Care Page <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {step === 'PAYMENT' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Secure Checkout</h4>
                <div className="space-y-3">
                  <button onClick={handleRazorpayCheckout} className="w-full">
                    <PaymentMethod 
                      icon={<Smartphone className="w-6 h-6" />} 
                      name="Razorpay" 
                      desc="UPI (PhonePe, GPay), Cards, Net Banking" 
                      selected={true} 
                    />
                  </button>
                  <PaymentMethod 
                    icon={<CreditCard className="w-6 h-6" />} 
                    name="Stripe" 
                    desc="Global Donations (Coming Soon)" 
                    disabled={true} 
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Donation Amount</span>
                  <span className="font-black text-slate-900">₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-4 border-t">
                  <span className="font-bold text-slate-500">Total Payable</span>
                  <span className="font-black text-blue-600 text-xl">₹{amount.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleRazorpayCheckout}
                className="w-full py-5 bg-slate-900 text-white font-black text-xl rounded-[2rem] shadow-2xl hover:bg-black flex items-center justify-center gap-3 transition-all"
              >
                <Lock className="w-5 h-5 text-emerald-400" /> Pay via Secure Razorpay
              </button>
              
              <button 
                onClick={() => setStep('AMOUNT')}
                className="w-full text-slate-400 font-bold text-sm hover:text-slate-600"
              >
                ← Back to amount selection
              </button>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="text-center py-20 space-y-8 animate-in fade-in duration-500">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900">Connecting to Razorpay</h3>
                <p className="text-slate-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                  Please do not refresh. Securing your ₹{amount.toLocaleString()} transaction through 256-bit encryption.
                </p>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center py-10 space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto scale-110">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-900">Transaction Successful!</h2>
                <p className="text-slate-500 font-medium text-lg px-4 leading-relaxed">
                  Thank you! Your gift of <strong>₹{amount.toLocaleString()}</strong> has been successfully credited to the JNMCH patient account.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Reference ID</span>
                  <span className="font-mono text-blue-600">PAY_LP_{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Verification Type</span>
                  <span className="text-emerald-600 uppercase text-[10px] font-black">Direct Hospital Credit</span>
                </div>
                <div className="pt-2">
                   <a 
                    href="https://www.aligscare.org/verify" 
                    target="_blank" 
                    className="flex items-center justify-center gap-2 w-full p-3 bg-white border rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-colors"
                  >
                    Verify on Alig Care Dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-5 bg-slate-900 text-white font-black text-xl rounded-[2rem] shadow-2xl hover:bg-black transition-all"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>

        {/* Universal Security Footer */}
        {step !== 'SUCCESS' && (
          <div className="px-8 py-6 bg-slate-900 text-white/50 text-center border-t border-white/5">
            <div className="flex justify-center gap-6 opacity-30 grayscale mb-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-4 invert" alt="Razorpay" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4 invert" alt="Stripe" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3" /> PCI-DSS Compliant • 80G Tax Benefit • Verified by Alig Care
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentMethod: React.FC<{ icon: React.ReactNode, name: string, desc: string, selected?: boolean, disabled?: boolean }> = ({ icon, name, desc, selected, disabled }) => (
  <div className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${disabled ? 'opacity-40 cursor-not-allowed border-slate-100' : selected ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
    <div className={`p-3 rounded-xl transition-colors ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <p className={`font-black text-sm ${selected ? 'text-blue-900' : 'text-slate-800'}`}>{name}</p>
        {selected && <div className="bg-emerald-100 text-emerald-600 text-[8px] px-1.5 py-0.5 rounded-full font-black">SECURE</div>}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none mt-1">{desc}</p>
    </div>
    {selected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
  </div>
);

export default DonationFlow;
