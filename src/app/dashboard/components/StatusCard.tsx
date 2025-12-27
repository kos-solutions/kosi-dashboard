"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function StatusCard() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [lastActivity, setLastActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeviceInfo();
  }, []);

  async function fetchDeviceInfo() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: pairedData, error: pairError } = await supabase
        .from('parent_devices')
        .select(`
          device_id,
          devices!inner (
            id,
            child_name,
            language,
            pairing_code
          )
        `)
        .eq('parent_id', user.id)
        .limit(1)
        .single();

      if (pairError || !pairedData) {
        console.log('No paired device:', pairError);
        setLoading(false);
        return;
      }

      const deviceRecord: any = pairedData.devices;
      
      if (deviceRecord && deviceRecord.id) {
        setDeviceInfo(deviceRecord);

        const { data: activity } = await supabase
          .from('activity_log')
          .select('*')
          .eq('device_id', deviceRecord.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (activity) {
          setLastActivity(activity);
        }
      }
    } catch (error) {
      console.error('Error fetching device info:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Copilul tău</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!deviceInfo) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Copilul tău</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Niciun dispozitiv conectat</p>
          <a
            href="/pairing"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Conectează un dispozitiv →
          </a>
        </div>
      </div>
    );
  }

  const getMoodEmoji = () => {
    if (!lastActivity) return "😊";
    
    const hoursSinceActivity = (Date.now() - new Date(lastActivity.timestamp).getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceActivity < 1) return "😊";
    if (hoursSinceActivity < 6) return "🙂";
    return "😴";
  };

  const getLastActivityText = () => {
    if (!lastActivity) return "Nicio activitate încă";
    return "Povești";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Copilul tău</h3>

      <div className="text-center mb-4">
        <div className="text-6xl mb-2">{getMoodEmoji()}</div>
        <div className="text-xl font-semibold text-gray-900">
          {deviceInfo.child_name || "Copil"}
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Stare generală</span>
          <span className="font-medium text-green-600">Calm {getMoodEmoji()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Ultima activitate</span>
          <span className="font-medium text-gray-900">{getLastActivityText()}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          Nu sunt motive de îngrijorare
        </p>
      </div>
    </div>
  );
}