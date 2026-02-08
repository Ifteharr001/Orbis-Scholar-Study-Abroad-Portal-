"use client";

import { 
  Building2, 
  Globe2, 
  CreditCard, 
  Copy, 
  Info, 
  ArrowRight,
  CheckCircle2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function PaymentProcessPage() {
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="outline" className="mb-4 text-blue-300 border-blue-400/30 px-4 py-1">
            Student Guide
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Payment Instructions
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed">
            Please follow the guidelines below to pay your Tuition Fees or Application Fees securely. 
            We recommend using official banking channels or university-authorized portals.
          </p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4 -mt-10 relative z-20">
        <Card className="shadow-2xl border-none">
          <CardContent className="p-6 md:p-10">
            <Tabs defaultValue="wire" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-10 h-auto bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="wire" className="py-3 font-medium text-sm md:text-base">
                  <Building2 className="mr-2 h-4 w-4" /> Bank Transfer (SWIFT)
                </TabsTrigger>
                <TabsTrigger value="portal" className="py-3 font-medium text-sm md:text-base">
                  <Globe2 className="mr-2 h-4 w-4" /> Student Portals (Flywire)
                </TabsTrigger>
                <TabsTrigger value="card" className="py-3 font-medium text-sm md:text-base">
                  <CreditCard className="mr-2 h-4 w-4" /> International Cards
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wire" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4">
                  <Info className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">How to pay via Bank Transfer?</h3>
                    <p className="text-blue-700 mt-1 text-sm leading-relaxed">
                      Print the bank details below and visit your local bank branch. Request a Foreign Demand Draft or Swift Transfer to the beneficiary account. Ensure you mention your <strong>Student ID</strong> in the reference.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Building2 className="text-primary" /> Beneficiary Details
                      </h3>
                      <div className="space-y-5">
                        <div className="pb-4 border-b border-dashed">
                          <p className="text-xs text-muted-foreground uppercase font-bold">Account Name</p>
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">Orbis Scholar Global Ltd.</p>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard("Orbis Scholar Global Ltd.")}>
                                <Copy className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                        <div className="pb-4 border-b border-dashed">
                          <p className="text-xs text-muted-foreground uppercase font-bold">Bank Name</p>
                          <p className="text-lg font-semibold">Standard Chartered Bank</p>
                        </div>
                        <div className="pb-4 border-b border-dashed">
                          <p className="text-xs text-muted-foreground uppercase font-bold">Swift Code (BIC)</p>
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-mono font-bold text-blue-600">SCBLBDDX</p>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard("SCBLBDDX")}>
                                <Copy className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold">IBAN / Account No.</p>
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-mono font-bold text-blue-600">01-1234567-01</p>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard("01-1234567-01")}>
                                <Copy className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-xl font-bold mb-4">Step-by-Step Process</h3>
                      <ol className="relative border-l border-slate-200 ml-3 space-y-8">
                        <li className="ml-6">
                          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-4 ring-white">
                            <span className="text-blue-600 font-bold text-xs">1</span>
                          </span>
                          <h4 className="font-semibold text-slate-900">Visit Your Bank</h4>
                          <p className="text-sm text-slate-500">Go to any bank that supports international student file processing.</p>
                        </li>
                        <li className="ml-6">
                          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-4 ring-white">
                            <span className="text-blue-600 font-bold text-xs">2</span>
                          </span>
                          <h4 className="font-semibold text-slate-900">Submit Documents</h4>
                          <p className="text-sm text-slate-500">Provide your Offer Letter, Passport Copy, and NOC (if required).</p>
                        </li>
                        <li className="ml-6">
                          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-4 ring-white">
                            <span className="text-blue-600 font-bold text-xs">3</span>
                          </span>
                          <h4 className="font-semibold text-slate-900">Get Swift Copy</h4>
                          <p className="text-sm text-slate-500">Once processed, collect the Swift Copy receipt as proof of payment.</p>
                        </li>
                      </ol>
                      
                      <Button variant="outline" className="w-full mt-4 gap-2">
                        <Download className="h-4 w-4" /> Download Bank Details PDF
                      </Button>
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="portal" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Paying via Student Portals</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Most international universities (UK, USA, Canada, Australia) use secure third-party portals like <strong>Flywire</strong> or <strong>Convera</strong>. This is the fastest and safest way to pay tuition fees.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                        <div>
                          <h4 className="font-bold">Log in to University Portal</h4>
                          <p className="text-sm text-slate-500">Go to your universitys official website and find the Pay Fees section.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                        <div>
                          <h4 className="font-bold">Select Payment Method</h4>
                          <p className="text-sm text-slate-500">Choose Flywire or Convera. Select your country (Bangladesh) to see local bank transfer options.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                        <div>
                          <h4 className="font-bold">Complete Transfer</h4>
                          <p className="text-sm text-slate-500">Follow the instructions to transfer funds from your local bank to the provided account.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="border rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold">Flywire</h4>
                        <Globe2 className="text-blue-500 h-5 w-5" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">Used by 2,000+ institutions globally.</p>
                      <Button variant="outline" className="w-full text-blue-600" onClick={() => window.open('https://www.flywire.com', '_blank')}>
                        Visit Flywire Website <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="border rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold">Convera</h4>
                        <Globe2 className="text-green-600 h-5 w-5" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">Formerly Western Union Business Solutions.</p>
                      <Button variant="outline" className="w-full text-green-600" onClick={() => window.open('https://www.convera.com', '_blank')}>
                        Visit Convera Website <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="card" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center max-w-2xl mx-auto py-10">
                  <div className="flex justify-center gap-4 mb-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-12 object-contain" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-12 object-contain" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Direct Card Payment</h3>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    If you have a <strong>Dual Currency Credit Card</strong> (endorsed with USD), you can pay directly on the universitys website.
                  </p>

                  <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl text-left">
                    <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                      <Info className="h-5 w-5" /> Important Note
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-yellow-700">
                      <li>Ensure your card has international transaction enabled.</li>
                      <li>Check your dollar limit endorsement on your passport.</li>
                      <li>Banks usually charge a 1% - 3% cross-currency markup fee.</li>
                      <li>Always keep a screenshot of the Payment Successful page.</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Confused about the process?</h2>
          <p className="text-muted-foreground mb-8">
            Our counselors can guide you through the banking process and help verify beneficiary details.
          </p>
          <div className="flex justify-center gap-4">
             <Button variant="default" size="lg">Contact Support</Button>
             <Button variant="outline" size="lg">Download Payment Guide</Button>
          </div>
        </div>
      </section>

    </div>
  );
}