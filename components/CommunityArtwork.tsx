import React, { useState, useEffect } from 'react';
import { Upload, Download, Search, Image as ImageIcon, FileArchive, X, Loader2, AlertCircle } from 'lucide-react';

interface Artwork {
    id: string;
    title: string;
    description: string;
    filename: string;
    originalName: string;
    mimetype: string;
    uploadedAt: string;
    size: number;
}

const CommunityArtwork: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Search & Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'image' | 'zip'>('all');

    // Upload State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        file: null as File | null
    });

    const fetchArtworks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/artwork');
            if (!response.ok) throw new Error('Failed to fetch artwork');
            const data = await response.json();
            setArtworks(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load community artwork. Is the server running?');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArtworks();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadForm({ ...uploadForm, file: e.target.files[0] });
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadForm.file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', uploadForm.file);
        formData.append('title', uploadForm.title);
        formData.append('description', uploadForm.description);

        try {
            const res = await fetch('/api/artwork', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Upload failed');
            }

            await fetchArtworks(); // Refresh list
            setIsUploadModalOpen(false);
            setUploadForm({ title: '', description: '', file: null });
            alert('Artwork uploaded successfully!');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    // Filtered Artworks
    const filteredArtworks = artworks.filter(art => {
        const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.description.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterType === 'all') return matchesSearch;
        if (filterType === 'image') return matchesSearch && art.mimetype?.startsWith('image/');
        if (filterType === 'zip') return matchesSearch && !art.mimetype?.startsWith('image/'); // Simplify zip check

        return matchesSearch;
    });

    // Drag and Drop Handlers
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadForm({ ...uploadForm, file: e.dataTransfer.files[0] });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1b2838] transition-colors duration-300">
            {/* Header Section */}
            <div className="bg-white dark:bg-[#171a21] border-b border-gray-200 dark:border-white/5 shadow-sm">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Community Artwork
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                                Upload and share Steam Profile Artwork designs. Browse community creations and download artwork for your Steam profile.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
                        >
                            <Upload className="w-5 h-5" />
                            Upload Artwork
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow max-w-2xl">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search artwork by title or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-[#2a475e] border border-transparent focus:border-blue-500 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 transition-colors"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-[#2a475e] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#419bc9]'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterType('image')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-[#2a475e] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#419bc9]'}`}
                            >
                                Images
                            </button>
                            <button
                                onClick={() => setFilterType('zip')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'zip' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-[#2a475e] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#419bc9]'}`}
                            >
                                Packs (ZIP)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="container mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg text-center">
                        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-red-700 dark:text-red-400">{error}</p>
                    </div>
                ) : filteredArtworks.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No artwork found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredArtworks.map((art) => (
                            <div key={art.id} className="bg-white dark:bg-[#171a21] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-white/5 flex flex-col h-full group">
                                {/* Preview Area */}
                                <div className="aspect-video bg-gray-800 relative overflow-hidden flex items-center justify-center">
                                    {art.mimetype?.startsWith('image/') ? (
                                        <img
                                            src={`/uploads/${art.filename}`}
                                            alt={art.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="text-gray-400 flex flex-col items-center">
                                            <FileArchive className="w-16 h-16 mb-2" />
                                            <span className="text-xs uppercase font-bold tracking-wider">ZIP Archive</span>
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                        <a
                                            href={`/uploads/${art.filename}`}
                                            download={art.originalName} // Force download
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    </div>
                                </div>

                                {/* Info Area */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2" title={art.title}>
                                            {art.title}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                                        {art.description || 'No description provided.'}
                                    </p>

                                    <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-100 dark:border-white/5 pt-3 mt-auto">
                                        <span>{(art.size / 1024 / 1024).toFixed(2)} MB</span>
                                        <span>{new Date(art.uploadedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1b2838] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Artwork</h2>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Artwork Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={uploadForm.title}
                                    onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2a475e] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Neon Cyberpunk Set"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={uploadForm.description}
                                    onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2a475e] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                    placeholder="Tell us about your artwork..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    File (Image or ZIP) *
                                </label>
                                <div
                                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer relative ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#2a475e]/50'}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <div className="space-y-1 text-center">
                                        <Upload className={`mx-auto h-12 w-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" required onChange={handleFileChange} accept=".png,.jpg,.jpeg,.gif,.zip" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 5MB (or ZIP packs)
                                        </p>
                                        {uploadForm.file && (
                                            <p className="text-sm font-bold text-green-500 mt-2">
                                                Selected: {uploadForm.file.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        'Submit Artwork'
                                    )}
                                </button>
                            </div>

                            <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-2">
                                All artwork belongs to their respective creators. Upload only content you have the right to share.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityArtwork;
