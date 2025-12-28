import React, { useState } from 'react';
import { SOSContact } from '../types';
import { Phone, X, ShieldAlert, Settings, Plus, Trash2, Ambulance, Hospital, Smartphone } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isChild: boolean;
  contacts: SOSContact[];
  onUpdateContacts: (contacts: SOSContact[]) => void;
}

const SOSDialog: React.FC<Props> = ({ isOpen, onClose, isChild, contacts, onUpdateContacts }) => {
  const [step, setStep] = useState<'INITIAL' | 'SETTINGS'>('INITIAL');
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  if (!isOpen) return null;

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    const contact: SOSContact = {
      id: Math.random().toString(36).substr(2, 9),
      ...newContact
    };
    onUpdateContacts([...contacts, contact]);
    setNewContact({ name: '', phone: '', relation: '' });
  };

  const removeContact = (id: string) => {
    onUpdateContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className={`relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200 ${isChild ? 'child-font' : ''}`}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400">
          <X className="w-5 h-5" />
        </button>

        {step === 'INITIAL' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-rose-200">
              <ShieldAlert className="w-10 h-10 text-rose-600 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                {isChild ? 'Emergency Help!' : 'SOS Response Hub'}
              </h2>
              <p className="text-slate-500 font-medium">
                {isChild 
                  ? "We're here for you! Call for help immediately." 
                  : "One-tap connection to JNMCH and emergency medical services."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <a 
                href="tel:112"
                className="w-full bg-rose-600 text-white p-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-rose-700 transition-all shadow-xl shadow-rose-200"
              >
                <Phone className="w-6 h-6" />
                Call Emergency 112
              </a>
              
              <a 
                href="tel:0571-2700921"
                className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl"
              >
                <Hospital className="w-6 h-6 text-blue-400" />
                JNMCH Oncology Desk
              </a>

              <a 
                href="tel:0571-2700021"
                className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl"
              >
                <Ambulance className="w-6 h-6" />
                AMU Medical Helpline
              </a>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Saved Personal Contacts</p>
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {contacts.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <div className="text-left">
                      <p className="font-black text-slate-800 text-sm">{c.name} <span className="text-[10px] text-slate-400 font-bold uppercase ml-2">{c.relation}</span></p>
                      <p className="text-xs text-slate-500 font-medium">{c.phone}</p>
                    </div>
                    <a href={`tel:${c.phone}`} className="p-3 bg-white text-rose-600 rounded-xl shadow-sm border border-rose-50 hover:bg-rose-600 hover:text-white transition-all">
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                ))}
                {contacts.length === 0 && (
                  <p className="text-slate-400 font-bold italic py-2 text-xs">No personal SOS contacts added.</p>
                )}
              </div>
            </div>

            <button 
              onClick={() => setStep('SETTINGS')}
              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 py-2 flex items-center justify-center gap-2 w-full mt-2"
            >
              <Settings className="w-4 h-4" /> Manage Contacts
            </button>
          </div>
        )}

        {step === 'SETTINGS' && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black tracking-tight">Manage Contacts</h3>
              <p className="text-slate-500 font-medium text-sm">Add people to your emergency circle.</p>
            </div>
            
            <div className="space-y-3">
              <input 
                type="text"
                value={newContact.name}
                onChange={e => setNewContact({...newContact, name: e.target.value})}
                placeholder="Contact Name"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-400 font-bold"
              />
              <div className="flex gap-2">
                <input 
                  type="tel"
                  value={newContact.phone}
                  onChange={e => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="Phone Number"
                  className="flex-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-400 font-bold"
                />
                <input 
                  type="text"
                  value={newContact.relation}
                  onChange={e => setNewContact({...newContact, relation: e.target.value})}
                  placeholder="Relation"
                  className="w-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-400 font-bold"
                />
              </div>
              <button 
                onClick={addContact}
                disabled={!newContact.name || !newContact.phone}
                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Plus className="w-5 h-5" /> Add to Circle
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {contacts.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                    <p className="text-[10px] text-slate-400 font-black">{c.phone}</p>
                  </div>
                  <button onClick={() => removeContact(c.id)} className="p-2 text-slate-300 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setStep('INITIAL')}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSDialog;