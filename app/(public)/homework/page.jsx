'use client'

import { useState, useRef, useEffect } from 'react'
import { 
    Send, 
    Bot, 
    User, 
    Loader2, 
    Upload, 
    FileText, 
    ImageIcon, 
    X, 
    Paperclip,
    Calculator,
    BookOpen,
    Globe,
    Atom,
    PenTool,
    Lightbulb,
    Star,
    CheckCircle,
    AlertCircle,
    Copy,
    Download,
    RefreshCw
} from 'lucide-react'
import PageTitle from '@/components/PageTitle'

export default function HomeworkHelp() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: "Hi there! 👋 I'm your AI homework assistant. I can help you with:\n\n• Math problems and equations\n• Science concepts and experiments\n• Essay writing and literature analysis\n• History questions and research\n• Study tips and explanations\n\nWhat homework can I help you with today?",
            timestamp: new Date(),
            subject: null
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [showFileUpload, setShowFileUpload] = useState(false)
    const [showQuickActions, setShowQuickActions] = useState(true)
    
    const messagesEndRef = useRef(null)
    const fileInputRef = useRef(null)
    const textareaRef = useRef(null)

    const subjects = [
        { name: 'Math', icon: Calculator, color: 'bg-blue-100 text-blue-600 border-blue-200' },
        { name: 'Science', icon: Atom, color: 'bg-green-100 text-green-600 border-green-200' },
        { name: 'English', icon: PenTool, color: 'bg-purple-100 text-purple-600 border-purple-200' },
        { name: 'History', icon: BookOpen, color: 'bg-orange-100 text-orange-600 border-orange-200' },
        { name: 'Geography', icon: Globe, color: 'bg-teal-100 text-teal-600 border-teal-200' },
        { name: 'Other', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' }
    ]

    const quickActions = [
        { text: "Help me solve this math problem", subject: "Math" },
        { text: "Explain this science concept", subject: "Science" },
        { text: "Help me write an essay", subject: "English" },
        { text: "Check my work and give feedback", subject: null },
        { text: "Create practice questions", subject: null },
        { text: "Explain this topic step by step", subject: null }
    ]

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        adjustTextareaHeight()
    }, [input])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
        }
    }

    const handleSubmit = async (e, messageText = input) => {
        e?.preventDefault()
        if (!messageText.trim() && uploadedFiles.length === 0) return

        // Hide quick actions after first message
        setShowQuickActions(false)

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
            subject: selectedSubject,
            files: uploadedFiles.length > 0 ? [...uploadedFiles] : null
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setUploadedFiles([])
        setShowFileUpload(false)
        setIsLoading(true)

        // TODO: Replace with actual API call
        try {
            // Placeholder API call structure
            // const response = await fetch('/api/homework-help', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         message: messageText,
            //         subject: selectedSubject,
            //         files: uploadedFiles,
            //         context: messages
            //     })
            // })
            // const data = await response.json()

            // Simulate API response for now
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))
            
            const responses = [
                "I'd be happy to help you with that! Let me break this down step by step:\n\n1. First, let's identify what we're working with\n2. Then we'll apply the relevant concepts\n3. Finally, we'll solve it together\n\nCould you share more details about the specific problem?",
                "Great question! This is a common topic that many students find challenging. Here's how I'd approach it:\n\n• Start with the fundamentals\n• Work through examples\n• Practice similar problems\n\nWhat specific part would you like me to focus on first?",
                "I can definitely help you understand this concept better! Let me explain it in simple terms and then we can work through some examples together.\n\nWhich aspect of this topic is giving you the most trouble?",
                "Perfect! I love helping with homework. Based on what you've shared, here are a few key points to consider:\n\n✓ This connects to several important concepts\n✓ There are multiple ways to approach this\n✓ Practice will help reinforce your understanding\n\nLet's start with the basics - what do you already know about this topic?"
            ]

            const botMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date(),
                subject: selectedSubject,
                helpful: null
            }

            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            console.error('Error:', error)
            const errorMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
                timestamp: new Date(),
                error: true
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files)
        const newFiles = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
        }))
        setUploadedFiles(prev => [...prev, ...newFiles])
    }

    const removeFile = (fileId) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) return ImageIcon
        return FileText
    }

    const markAsHelpful = (messageId, helpful) => {
        setMessages(prev => 
            prev.map(msg => 
                msg.id === messageId ? { ...msg, helpful } : msg
            )
        )
    }

    const copyMessage = (content) => {
        navigator.clipboard.writeText(content)
        // You could add a toast notification here
    }

    const handleQuickAction = (action) => {
        setSelectedSubject(action.subject)
        handleSubmit(null, action.text)
    }

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                role: 'assistant',
                content: "Hi there! 👋 I'm your AI homework assistant. I can help you with:\n\n• Math problems and equations\n• Science concepts and experiments\n• Essay writing and literature analysis\n• History questions and research\n• Study tips and explanations\n\nWhat homework can I help you with today?",
                timestamp: new Date(),
                subject: null
            }
        ])
        setShowQuickActions(true)
        setSelectedSubject(null)
        setInput('')
        setUploadedFiles([])
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <PageTitle 
                    title="Homework Help AI"
                    subtitle="Get instant help with your assignments from our intelligent AI tutor"
                />

                {/* Subject Filter & Actions */}
                <div className="mt-6 mb-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        {/* Subject Pills */}
                        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSelectedSubject(null)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                                    selectedSubject === null 
                                        ? 'bg-[#5C3AEB] text-white border-[#5C3AEB] shadow-lg' 
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                                }`}
                            >
                                All Subjects
                            </button>
                            {subjects.map((subject) => {
                                const Icon = subject.icon
                                return (
                                    <button
                                        key={subject.name}
                                        onClick={() => setSelectedSubject(subject.name)}
                                        className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                                            selectedSubject === subject.name 
                                                ? 'bg-[#5C3AEB] text-white border-[#5C3AEB] shadow-lg' 
                                                : `${subject.color} hover:shadow-md border`
                                        }`}
                                    >
                                        <Icon size={16} />
                                        <span>{subject.name}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={clearChat}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200"
                                title="Clear chat"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#5C3AEB] rounded-full flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">AI Homework Assistant</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Online & Ready to Help</span>
                                </div>
                            </div>
                        </div>
                        {selectedSubject && (
                            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                📚 {selectedSubject}
                            </div>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="h-[500px] overflow-y-auto p-6 space-y-6">
                        {messages.map((message, index) => (
                            <div
                                key={message.id || index}
                                className={`flex items-start gap-4 ${
                                    message.role === 'user' ? 'flex-row-reverse' : ''
                                }`}
                            >
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                    message.role === 'user' 
                                        ? 'bg-gray-600' 
                                        : message.error 
                                        ? 'bg-red-100'
                                        : 'bg-[#5C3AEB]'
                                }`}>
                                    {message.role === 'user' 
                                        ? <User size={20} className="text-white" /> 
                                        : <Bot size={20} className={message.error ? 'text-red-600' : 'text-white'} />
                                    }
                                </div>
                                
                                <div className="flex-1 max-w-3xl">
                                    <div className={`p-4 rounded-2xl ${
                                        message.role === 'user'
                                            ? 'bg-[#5C3AEB] text-white rounded-tr-md'
                                            : message.error
                                            ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-md'
                                            : 'bg-gray-100 text-gray-800 rounded-tl-md'
                                    }`}>
                                        {message.subject && (
                                            <div className={`text-xs mb-2 opacity-75`}>
                                                📚 {message.subject}
                                            </div>
                                        )}
                                        
                                        <div className="whitespace-pre-wrap leading-relaxed">
                                            {message.content}
                                        </div>
                                        
                                        {message.files && (
                                            <div className="mt-3 space-y-2">
                                                {message.files.map((file) => {
                                                    const FileIcon = getFileIcon(file.type)
                                                    return (
                                                        <div key={file.id} className="flex items-center space-x-2 text-sm opacity-90">
                                                            <FileIcon size={16} />
                                                            <span>{file.name}</span>
                                                            <span className="text-xs opacity-70">({formatFileSize(file.size)})</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Message Actions */}
                                    <div className="flex items-center justify-between mt-2 px-1">
                                        <span className="text-xs text-gray-500">
                                            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                        
                                        <div className="flex items-center space-x-2">
                                            {message.role === 'assistant' && !message.error && (
                                                <>
                                                    <button
                                                        onClick={() => copyMessage(message.content)}
                                                        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                                                        title="Copy message"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                    
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-xs text-gray-500">Helpful?</span>
                                                        <button
                                                            onClick={() => markAsHelpful(message.id, true)}
                                                            className={`p-1 rounded transition-colors ${
                                                                message.helpful === true 
                                                                    ? 'text-green-600 bg-green-100' 
                                                                    : 'text-gray-400 hover:text-green-600'
                                                            }`}
                                                        >
                                                            <CheckCircle size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => markAsHelpful(message.id, false)}
                                                            className={`p-1 rounded transition-colors ${
                                                                message.helpful === false 
                                                                    ? 'text-red-600 bg-red-100' 
                                                                    : 'text-gray-400 hover:text-red-600'
                                                            }`}
                                                        >
                                                            <AlertCircle size={14} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-[#5C3AEB] rounded-full flex items-center justify-center">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div className="flex-1 p-4 rounded-2xl bg-gray-100 text-gray-700 rounded-tl-md">
                                    <div className="flex items-center space-x-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {showQuickActions && (
                        <div className="border-t border-gray-100 p-4">
                            <div className="flex items-center mb-3">
                                <Star className="w-4 h-4 text-[#5C3AEB] mr-2" />
                                <span className="text-sm font-medium text-gray-700">Quick Start</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickAction(action)}
                                        className="text-left p-3 text-sm border border-gray-200 rounded-lg hover:border-[#5C3AEB] hover:bg-blue-50 transition-all duration-200 group"
                                    >
                                        <span className="text-gray-700 group-hover:text-[#5C3AEB]">
                                            {action.text}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* File Upload Area */}
                    {showFileUpload && (
                        <div className="border-t border-gray-100 p-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                multiple
                                accept="image/*,.pdf,.doc,.docx,.txt"
                                className="hidden"
                            />
                            <div 
                                className=" border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#5C3AEB] transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-1">
                                    Upload homework files
                                </p>
                                <p className="text-xs text-gray-500">
                                    Images, PDFs, Word documents (Max 10MB each)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Uploaded Files Preview */}
                    {uploadedFiles.length > 0 && (
                        <div className="border-t border-gray-100 p-4 space-y-2">
                            <div className="text-sm font-medium text-gray-700 mb-2">Attached Files:</div>
                            {uploadedFiles.map((file) => {
                                const FileIcon = getFileIcon(file.type)
                                return (
                                    <div
                                        key={file.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FileIcon className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(file.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="border-t border-gray-100 p-4">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="flex items-end gap-3">
                                {/* File Upload Toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowFileUpload(!showFileUpload)}
                                    className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                                        showFileUpload || uploadedFiles.length > 0
                                            ? 'bg-[#5C3AEB] text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                    title="Attach files"
                                >
                                    <Paperclip size={20} />
                                </button>
                                
                                {/* Text Input */}
                                <div className="flex-1 relative">
                                    <textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                handleSubmit(e)
                                            }
                                        }}
                                        placeholder="Ask me anything about your homework..."
                                        className="w-full p-4 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]/20 focus:border-[#5C3AEB] transition-all duration-200"
                                        rows="1"
                                        style={{ minHeight: '56px', maxHeight: '120px' }}
                                    />
                                </div>
                                
                                {/* Send Button */}
                                <button
                                    type="submit"
                                    disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
                                    className={`flex-shrink-0 px-6 py-4 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 ${
                                        (input.trim() || uploadedFiles.length > 0) && !isLoading
                                            ? 'bg-[#5C3AEB] hover:bg-[#3525b8] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <span className="hidden sm:inline">Send</span>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>
                            
                            <p className="text-xs text-gray-500 text-center">
                                Press Enter to send • Shift + Enter for new line
                            </p>
                        </form>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>💡 Tip: Be specific with your questions for better help. Include subject, grade level, and any specific requirements.</p>
                </div>
            </div>
        </div>
    )
}