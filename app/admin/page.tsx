'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, TrendingUp, List, BarChart2, ChevronDown, ChevronUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { format, parseISO } from 'date-fns';
import ReCAPTCHA from "react-google-recaptcha";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface WaitlistEntry {
  id: string;
  email: string;
  timestamp: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [cumulativeChartData, setCumulativeChartData] = useState<{ name: string; total: number }[]>([]);
  const [dailyChartData, setDailyChartData] = useState<{ name: string; signups: number }[]>([]);
  const [loginError, setLoginError] = useState('');
  const [waitlistPage, setWaitlistPage] = useState(1);
  const [totalWaitlistEntries, setTotalWaitlistEntries] = useState(0);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) {
      setLoginError('Please complete the CAPTCHA');
      return;
    }
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, captchaToken }),
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        const data = await response.json();
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchWaitlist = async () => {
        const response = await fetch(`/api/admin/waitlist?page=${waitlistPage}`);
        const data = await response.json();
        setWaitlist(data.entries);
        setTotalWaitlistEntries(data.total);

        // Prepare cumulative chart data
        const sortedData = data.entries.sort((a: WaitlistEntry, b: WaitlistEntry) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        const cumulativeData = sortedData.reduce((acc: any[], entry: WaitlistEntry, index: number) => {
          const date = format(parseISO(entry.timestamp), 'MMM d');
          if (acc.length === 0 || acc[acc.length - 1].name !== date) {
            acc.push({ name: date, total: index + 1 });
          } else {
            acc[acc.length - 1].total = index + 1;
          }
          return acc;
        }, []);
        setCumulativeChartData(cumulativeData);

        // Prepare daily chart data
        const dailyCounts: { [key: string]: number } = {};
        sortedData.forEach((entry: WaitlistEntry) => {
          const date = format(parseISO(entry.timestamp), 'MMM d');
          dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });
        const dailyData = Object.entries(dailyCounts).map(([name, signups]) => ({ name, signups }));
        setDailyChartData(dailyData);
      };
      fetchWaitlist();
    }
  }, [isAuthenticated, waitlistPage]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-100 to-white px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-800">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="text-lg py-2"
              />
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                  onChange={setCaptchaToken}
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-center">{loginError}</p>
              )}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-2">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-800 text-center">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <Users className="mr-2" /> Total Signups
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-4xl font-bold text-green-800">{waitlist.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <UserPlus className="mr-2" /> Latest Signup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-lg font-semibold text-green-800">{waitlist[0]?.email}</p>
            <p className="text-sm text-gray-500">
              {waitlist[0]?.timestamp ? format(parseISO(waitlist[0].timestamp), 'MMM d, yyyy h:mm a') : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <TrendingUp className="mr-2" /> Cumulative Signups
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeChartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#22c55e" fill="url(#gradient)" strokeWidth={2} />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <BarChart2 className="mr-2" /> Daily Signups
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip />
                  <Bar dataKey="signups" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6 bg-white shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-green-600 text-white">
          <CardTitle className="flex items-center text-xl">
            <List className="mr-2" /> Waitlist Entries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="waitlist">
              <AccordionTrigger>
                View Waitlist ({totalWaitlistEntries} entries)
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                  {waitlist.map((entry) => (
                    <li key={entry.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium text-green-800">{entry.email}</span>
                      <span className="text-sm text-gray-500">
                        {format(parseISO(entry.timestamp), 'MMM d, yyyy h:mm a')}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    onClick={() => setWaitlistPage(prev => Math.max(prev - 1, 1))}
                    disabled={waitlistPage === 1}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Previous
                  </Button>
                  <span>Page {waitlistPage}</span>
                  <Button
                    onClick={() => setWaitlistPage(prev => prev + 1)}
                    disabled={waitlist.length < 10}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Next
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}