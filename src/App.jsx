import { useState } from 'react'
import ParentApp from './components/ParentApp'
import TeacherApp from './components/TeacherApp'

export default function App() {
  const [role, setRole] = useState('parent')

  return (
    <div className="min-h-screen bg-sky-50">
      <div className="max-w-md mx-auto p-4">
        <div className="flex gap-2 pt-4 pb-2 justify-center">
          <button onClick={()=>setRole('parent')} className={`px-4 py-2 rounded-full text-sm font-medium ${role==='parent'?'bg-sky-600 text-white':'bg-white border border-slate-200 text-slate-700'}`}>Parent</button>
          <button onClick={()=>setRole('teacher')} className={`px-4 py-2 rounded-full text-sm font-medium ${role==='teacher'?'bg-emerald-600 text-white':'bg-white border border-slate-200 text-slate-700'}`}>Teacher</button>
        </div>
      </div>
      {role === 'parent' ? <ParentApp /> : <TeacherApp />}
    </div>
  )
}
