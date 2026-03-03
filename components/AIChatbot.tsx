
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MOCK_PRODUCTS } from '../data';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    {role: 'ai', text: 'Chào bạn! Mình là AI Assistant của ShopStudent. Bạn cần mình tư vấn Laptop hay phụ kiện gì cho việc học không?'}
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure fresh configuration
      // Always use process.env.API_KEY as the hard requirement for initialization
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const productContext = MOCK_PRODUCTS.map(p => `${p.name}: ${p.price.toLocaleString()}đ - ${p.description}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Bạn là trợ lý bán hàng thân thiện của cửa hàng "ShopStudent". 
        Dưới đây là danh sách sản phẩm hiện có:
        ${productContext}
        
        Hãy trả lời câu hỏi của khách hàng một cách ngắn gọn, tập trung vào nhu cầu sinh viên. 
        Nếu hỏi về giá, hãy báo đúng giá từ danh sách.
        Câu hỏi khách hàng: ${userMsg}`,
      });

      // Directly access .text property from GenerateContentResponse
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Xin lỗi, mình đang bận một chút. Bạn thử lại nhé!" }]);
    } catch (error) {
        console.error("AI Error:", error);
        setMessages(prev => [...prev, { role: 'ai', text: "Để sử dụng tính năng AI này, bạn cần cấu hình Gemini API Key trong Vercel Environment Variables nhé!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Chat Bubble Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
      >
        <span className="material-symbols-outlined text-3xl">
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="bg-primary p-4 text-white flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined">robot_2</span>
             </div>
             <div>
                <h4 className="font-bold text-sm">ShopStudent AI</h4>
                <div className="flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                   <span className="text-[10px] opacity-80 uppercase font-bold tracking-widest">Đang trực tuyến</span>
                </div>
             </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
             {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                     msg.role === 'user' 
                     ? 'bg-primary text-white rounded-tr-none' 
                     : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                   }`}>
                      {msg.text}
                   </div>
                </div>
             ))}
             {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                   </div>
                </div>
             )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Hỏi AI về Laptop sinh viên..."
                  className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping}
                  className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
