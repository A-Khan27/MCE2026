import { useState, useEffect, useRef } from 'react';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Upload,
  ImageIcon,
  Shield,
  Camera,
} from 'lucide-react';
import { Candidate } from '../../types';
import { candidates as defaultCandidates } from '../../data/candidates';

const colorOptions = [
  { label: 'Blue → Indigo', value: 'from-blue-500 to-indigo-600' },
  { label: 'Purple → Pink', value: 'from-purple-500 to-pink-600' },
  { label: 'Emerald → Teal', value: 'from-emerald-500 to-teal-600' },
  { label: 'Orange → Red', value: 'from-orange-500 to-red-600' },
  { label: 'Cyan → Blue', value: 'from-cyan-500 to-blue-600' },
  { label: 'Rose → Fuchsia', value: 'from-rose-500 to-fuchsia-600' },
  { label: 'Amber → Orange', value: 'from-amber-500 to-orange-600' },
  { label: 'Lime → Emerald', value: 'from-lime-500 to-emerald-600' },
];

const emojiOptions = ['🧮', '📐', '∑', '📊', '🎓', '📚', '🔬', '💡', '🏆', '⚡', 'π', '∞', '√', 'Δ', '∫', 'θ'];

const emptyCandidate: Candidate = {
  id: '',
  name: '',
  position: 'GS',
  department: 'Mathematics',
  year: '3rd Year',
  tagline: '',
  bio: '',
  avatar: '🧮',
  color: 'from-blue-500 to-indigo-600',
  profilePicture: '',
  symbol: '',
  promises: [''],
  vision: '',
  achievements: [''],
  socials: { email: '' },
};

function ImageUploader({
  label,
  currentImage,
  onImageChange,
  onRemove,
  shape = 'rounded',
  icon,
  placeholderText,
}: {
  label: string;
  currentImage?: string;
  onImageChange: (base64: string) => void;
  onRemove: () => void;
  shape?: 'rounded' | 'circle';
  icon: React.ReactNode;
  placeholderText: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>

      {currentImage ? (
        <div className="relative group">
          <div
            className={`w-full aspect-square max-w-[200px] overflow-hidden border-2 border-white/20 shadow-xl ${
              shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
            }`}
          >
            <img
              src={currentImage}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 max-w-[200px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              className={`absolute inset-0 bg-black/60 ${
                shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
              }`}
            />
            <div className="relative flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-indigo-500/80 text-white hover:bg-indigo-500 transition-colors"
                title="Change image"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="p-2.5 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full max-w-[200px] aspect-square flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all ${
            shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
          } ${
            dragOver
              ? 'border-indigo-400 bg-indigo-500/10'
              : 'border-white/20 bg-white/5 hover:border-indigo-400/50 hover:bg-white/10'
          }`}
        >
          <Upload className={`w-8 h-8 mb-2 ${dragOver ? 'text-indigo-400' : 'text-slate-500'}`} />
          <span className="text-slate-400 text-xs text-center px-4">{placeholderText}</span>
          <span className="text-slate-600 text-[10px] mt-1">Max 5MB • JPG, PNG</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mathclub-candidates');
    if (stored) {
      setCandidates(JSON.parse(stored));
    } else {
      setCandidates(defaultCandidates);
      localStorage.setItem('mathclub-candidates', JSON.stringify(defaultCandidates));
    }
  }, []);

  const saveCandidates = (updated: Candidate[]) => {
    setCandidates(updated);
    localStorage.setItem('mathclub-candidates', JSON.stringify(updated));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = () => {
    setEditingCandidate({ ...emptyCandidate });
    setIsCreating(true);
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate({
      ...candidate,
      promises: [...candidate.promises],
      achievements: [...candidate.achievements],
    });
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!editingCandidate) return;
    if (!editingCandidate.name.trim() || !editingCandidate.tagline.trim()) {
      showToast('Name and tagline are required!', 'error');
      return;
    }

    const candidate = {
      ...editingCandidate,
      id:
        editingCandidate.id ||
        editingCandidate.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      promises: editingCandidate.promises.filter((p) => p.trim()),
      achievements: editingCandidate.achievements.filter((a) => a.trim()),
    };

    let updated: Candidate[];
    if (isCreating) {
      updated = [...candidates, candidate];
      showToast(`${candidate.name} added successfully!`);
    } else {
      updated = candidates.map((c) => (c.id === candidate.id ? candidate : c));
      showToast(`${candidate.name} updated successfully!`);
    }

    saveCandidates(updated);
    setEditingCandidate(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    const candidate = candidates.find((c) => c.id === id);
    const updated = candidates.filter((c) => c.id !== id);
    saveCandidates(updated);
    setDeleteConfirm(null);
    showToast(`${candidate?.name || 'Candidate'} removed.`, 'error');
  };

  const updateField = (field: keyof Candidate, value: string) => {
    if (!editingCandidate) return;
    setEditingCandidate({ ...editingCandidate, [field]: value });
  };

  const updateListItem = (field: 'promises' | 'achievements', index: number, value: string) => {
    if (!editingCandidate) return;
    const list = [...editingCandidate[field]];
    list[index] = value;
    setEditingCandidate({ ...editingCandidate, [field]: list });
  };

  const addListItem = (field: 'promises' | 'achievements') => {
    if (!editingCandidate) return;
    setEditingCandidate({ ...editingCandidate, [field]: [...editingCandidate[field], ''] });
  };

  const removeListItem = (field: 'promises' | 'achievements', index: number) => {
    if (!editingCandidate) return;
    const list = editingCandidate[field].filter((_, i) => i !== index);
    setEditingCandidate({ ...editingCandidate, [field]: list });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-white flex items-center gap-2"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            <Users className="w-6 h-6 text-blue-400" />
            Manage Candidates
          </h1>
          <p className="text-slate-400 text-sm mt-1">{candidates.length} registered candidates</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Edit/Create Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl my-8 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-slate-900 rounded-t-2xl">
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'Space Grotesk' }}
              >
                {isCreating ? 'Add New Candidate' : `Edit: ${editingCandidate.name}`}
              </h2>
              <button
                onClick={() => {
                  setEditingCandidate(null);
                  setIsCreating(false);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* ===== PROFILE PICTURE & ELECTION SYMBOL ===== */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Camera className="w-4 h-4 text-indigo-400" />
                  Candidate Images
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ImageUploader
                    label="Profile Picture"
                    currentImage={editingCandidate.profilePicture}
                    onImageChange={(base64) =>
                      setEditingCandidate({ ...editingCandidate, profilePicture: base64 })
                    }
                    onRemove={() =>
                      setEditingCandidate({ ...editingCandidate, profilePicture: '' })
                    }
                    shape="circle"
                    icon={<ImageIcon className="w-3.5 h-3.5 text-indigo-400" />}
                    placeholderText="Upload profile photo"
                  />
                  <ImageUploader
                    label="Election Symbol"
                    currentImage={editingCandidate.symbol}
                    onImageChange={(base64) =>
                      setEditingCandidate({ ...editingCandidate, symbol: base64 })
                    }
                    onRemove={() => setEditingCandidate({ ...editingCandidate, symbol: '' })}
                    shape="rounded"
                    icon={<Shield className="w-3.5 h-3.5 text-amber-400" />}
                    placeholderText="Upload election symbol"
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editingCandidate.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Position
                  </label>
                  <input
                    type="text"
                    value={editingCandidate.position}
                    onChange={(e) => updateField('position', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder="e.g. GS"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editingCandidate.department}
                    onChange={(e) => updateField('department', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder="e.g. Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Year</label>
                  <select
                    value={editingCandidate.year}
                    onChange={(e) => updateField('year', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                  >
                    {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Masters', 'PhD'].map(
                      (y) => (
                        <option key={y} value={y} className="bg-slate-900">
                          {y}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    value={editingCandidate.socials.email}
                    onChange={(e) =>
                      setEditingCandidate({
                        ...editingCandidate,
                        socials: { email: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder="candidate@email.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Tagline *
                  </label>
                  <input
                    type="text"
                    value={editingCandidate.tagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder='"Your Motto Here"'
                  />
                </div>
              </div>

              {/* Avatar Emoji & Color (kept as fallback) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Fallback Emoji (used if no photo)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => updateField('avatar', emoji)}
                        className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                          editingCandidate.avatar === emoji
                            ? 'bg-indigo-500/20 border-2 border-indigo-500 scale-110'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Theme Color
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateField('color', opt.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs ${
                          editingCandidate.color === opt.value
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${opt.value}`} />
                        <span className="text-slate-300">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Biography</label>
                <textarea
                  value={editingCandidate.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                  placeholder="A brief biography about the candidate..."
                />
              </div>

              {/* Vision */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Vision Statement
                </label>
                <textarea
                  value={editingCandidate.vision}
                  onChange={(e) => updateField('vision', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                  placeholder="What is their vision for the Math Club?"
                />
              </div>

              {/* Promises */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Promises ({editingCandidate.promises.filter((p) => p.trim()).length})
                </label>
                <div className="space-y-2">
                  {editingCandidate.promises.map((promise, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={promise}
                        onChange={(e) => updateListItem('promises', i, e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                        placeholder={`Promise ${i + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem('promises', i)}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addListItem('promises')}
                    className="flex items-center gap-1 text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Promise
                  </button>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Achievements ({editingCandidate.achievements.filter((a) => a.trim()).length})
                </label>
                <div className="space-y-2">
                  {editingCandidate.achievements.map((achievement, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateListItem('achievements', i, e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                        placeholder={`Achievement ${i + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem('achievements', i)}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addListItem('achievements')}
                    className="flex items-center gap-1 text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Achievement
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => {
                  setEditingCandidate(null);
                  setIsCreating(false);
                }}
                className="px-4 py-2.5 rounded-xl text-slate-400 text-sm font-medium hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
              >
                <Save className="w-4 h-4" />
                {isCreating ? 'Add Candidate' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidates List */}
      <div className="space-y-3">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
          >
            <div
              className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/[0.02] transition-all"
              onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
            >
              {/* Profile Picture or Avatar */}
              <div className="flex-shrink-0">
                {candidate.profilePicture ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                    <img
                      src={candidate.profilePicture}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${candidate.color} flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {candidate.avatar}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-bold">{candidate.name}</h3>
                  {/* Election Symbol badge */}
                  {candidate.symbol && (
                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
                      <img
                        src={candidate.symbol}
                        alt="Symbol"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-slate-400 text-sm">
                  {candidate.position} • {candidate.year} • {candidate.department}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-2">
                  {candidate.profilePicture ? (
                    <span className="text-emerald-400 text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Photo
                    </span>
                  ) : (
                    <span className="text-amber-400 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> No photo
                    </span>
                  )}
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-500 text-xs">
                    {candidate.promises.length} promises
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(candidate);
                  }}
                  className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {deleteConfirm === candidate.id ? (
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDelete(candidate.id)}
                      className="px-2 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-all"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-2 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(candidate.id);
                    }}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {expandedId === candidate.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>

            {expandedId === candidate.id && (
              <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                {/* Images Preview */}
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">
                      Profile Picture
                    </p>
                    {candidate.profilePicture ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
                        <img
                          src={candidate.profilePicture}
                          alt={candidate.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center">
                        <span className="text-slate-600 text-xs">No photo</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">
                      Election Symbol
                    </p>
                    {candidate.symbol ? (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20">
                        <img
                          src={candidate.symbol}
                          alt="Election Symbol"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center">
                        <span className="text-slate-600 text-xs">No symbol</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
                    Tagline
                  </p>
                  <p className="text-slate-300 text-sm italic">{candidate.tagline}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
                    Bio
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed">{candidate.bio}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">
                      Promises
                    </p>
                    <ul className="space-y-1">
                      {candidate.promises.map((p, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-indigo-400">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">
                      Achievements
                    </p>
                    <ul className="space-y-1">
                      {candidate.achievements.map((a, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-emerald-400">✓</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {candidates.length === 0 && (
        <div className="text-center py-16 rounded-2xl bg-white/5 border border-white/10">
          <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium">No candidates yet</p>
          <p className="text-slate-600 text-sm mt-1">
            Click "Add Candidate" to register your first candidate.
          </p>
        </div>
      )}
    </div>
  );
}
