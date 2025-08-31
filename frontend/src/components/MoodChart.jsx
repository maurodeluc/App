import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import api from '../services/api';

const MoodChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(90); // Default 3 months

  // Period options
  const periodOptions = [
    { value: 30, label: '30 giorni' },
    { value: 60, label: '60 giorni' },
    { value: 90, label: '3 mesi' },
    { value: 180, label: '6 mesi' },
    { value: 365, label: '1 anno' }
  ];

  useEffect(() => {
    fetchMoodTrend();
  }, [selectedPeriod]);

  const fetchMoodTrend = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/stats/mood-trend?days=${selectedPeriod}`);
      
      // Transform data for chart
      const formattedData = response.data.map(entry => ({
        date: entry.date,
        mood_score: entry.mood_id,
        mood_name: entry.mood_name,
        mood_emoji: entry.mood_emoji,
        mood_color: entry.mood_color,
        activities_count: entry.activities_count,
        note: entry.note,
        // Format date for display
        displayDate: new Date(entry.date).toLocaleDateString('it-IT', { 
          day: '2-digit', 
          month: 'short' 
        })
      }));

      setChartData(formattedData);
    } catch (err) {
      console.error('Error fetching mood trend:', err);
      setError('Errore nel caricamento dei dati del grafico');
    } finally {
      setLoading(false);
    }
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-800">{label}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl">{data.mood_emoji}</span>
            <span className="font-medium" style={{ color: data.mood_color }}>
              {data.mood_name}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {data.activities_count} attività
          </p>
          {data.note && (
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              "{data.note}"
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom dot for the line chart
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={payload.mood_color}
        stroke="#fff"
        strokeWidth={2}
      />
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Andamento del tuo umore</h3>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Andamento del tuo umore</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchMoodTrend}
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-2xl text-sm hover:bg-red-200 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Andamento del tuo umore</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">
            Non ci sono dati sufficienti per mostrare il grafico.<br/>
            Continua a registrare il tuo umore per vedere l'andamento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Andamento del tuo umore</h3>
        </div>
        
        {/* Period Selector */}
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(Number(e.target.value))}
          className="bg-gray-50 border-0 rounded-2xl px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {periodOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="displayDate" 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              domain={[1, 5]} 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => {
                const moods = {
                  1: '😞',
                  2: '😔', 
                  3: '😐',
                  4: '😊',
                  5: '😄'
                };
                return moods[value] || '';
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="mood_score"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex justify-center mt-4 gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <span>😞</span>
          <span>Molto male</span>
        </div>
        <div className="flex items-center gap-1">
          <span>😔</span>
          <span>Male</span>
        </div>
        <div className="flex items-center gap-1">
          <span>😐</span>
          <span>Neutro</span>
        </div>
        <div className="flex items-center gap-1">
          <span>😊</span>
          <span>Bene</span>
        </div>
        <div className="flex items-center gap-1">
          <span>😄</span>
          <span>Molto bene</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-2xl text-center">
          <div className="text-lg font-bold text-purple-700">{chartData.length}</div>
          <div className="text-xs text-purple-600">Entries registrate</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-2xl text-center">
          <div className="text-lg font-bold text-blue-700">
            {chartData.length > 0 
              ? (chartData.reduce((sum, entry) => sum + entry.mood_score, 0) / chartData.length).toFixed(1)
              : '0'
            }
          </div>
          <div className="text-xs text-blue-600">Umore medio</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-3 rounded-2xl text-center">
          <div className="text-lg font-bold text-green-700">
            {Math.round((chartData.reduce((sum, entry) => sum + entry.activities_count, 0) / Math.max(chartData.length, 1)) * 10) / 10}
          </div>
          <div className="text-xs text-green-600">Attività medie</div>
        </div>
      </div>
    </div>
  );
};

export default MoodChart;