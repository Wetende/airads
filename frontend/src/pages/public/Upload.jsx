import { useState, useEffect, useMemo } from "react";
import { Head } from "@inertiajs/react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import {
  UploadFile,
  Description,
  Delete,
  CheckCircle,
  Error,
  Visibility,
  Close,
  Logout,
  CalendarToday,
  Add,
  Edit,
  Save,
  BarChart,
  People,
  Folder,
  Menu,
  DarkMode,
  LightMode,
} from "@mui/icons-material";

const UploadPage = ({ onLogout }) => {
  const [pdfFiles, setPdfFiles] = useState({});
  const [events, setEvents] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    type: 'event',
    image: null
  });
  const [editingEvent, setEditingEvent] = useState(null);

  // Campus mapping - EXACTLY matching ApplicationForm.jsx keys
  const expectedFiles = [
    { name: "Bungoma.pdf", campus: "bungoma", displayName: "Bungoma Campus", color: "from-blue-400 to-blue-600" },
    { name: "Eldoret.pdf", campus: "eldoret", displayName: "Eldoret Campus", color: "from-red-400 to-red-600" },
    { name: "airads kisumu.pdf", campus: "kisumu", displayName: "Kisumu City Campus", color: "from-blue-400 to-blue-600" },
    { name: "LODWAR Campus.pdf", campus: "lodwar", displayName: "Lodwar Campus", color: "from-red-400 to-red-600" },
    { name: "Nakuru.pdf", campus: "nakuru", displayName: "Nakuru Campus", color: "from-blue-400 to-blue-600" },
    { name: "Airads Kericho.pdf", campus: "kericho", displayName: "Kericho Campus", color: "from-red-400 to-red-600" }
  ];

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('airads-dark-mode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('airads-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Load existing files and events from localStorage with error handling
  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem('airadsPdfFiles');
      const savedEvents = localStorage.getItem('airads-events');
      
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        // Convert back to internal format with validation
        const filesObject = {};
        if (Array.isArray(parsedFiles)) {
          parsedFiles.forEach(file => {
            const expectedFile = expectedFiles.find(ef => ef.campus === file.campus);
            if (expectedFile && file.data && file.name) {
              filesObject[expectedFile.name] = {
                name: file.name,
                data: file.data,
                size: file.size || 0,
                uploadDate: file.uploadDate || new Date().toISOString(),
                type: 'application/pdf',
                campus: file.campus
              };
            }
          });
          setPdfFiles(filesObject);
        }
      }

      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        if (Array.isArray(parsedEvents)) {
          setEvents(parsedEvents);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      // Clear corrupted data
      localStorage.removeItem('airadsPdfFiles');
      localStorage.removeItem('airads-events');
    }
  }, []);

  // Save files to localStorage in ApplicationForm format whenever pdfFiles changes
  useEffect(() => {
    try {
      const formattedFiles = Object.entries(pdfFiles).map(([fileName, file]) => {
        const campusFile = expectedFiles.find(ef => ef.name === fileName);
        return {
          id: `${campusFile?.campus || 'unknown'}-${Date.now()}`,
          name: fileName,
          data: file.data,
          size: file.size,
          uploadDate: file.uploadDate,
          campus: campusFile ? campusFile.campus : 'unknown',
          formType: 'application'
        };
      });
      
      // Always save to localStorage, even if empty
      localStorage.setItem('airadsPdfFiles', JSON.stringify(formattedFiles));
      
      // Trigger storage event for real-time sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'airadsPdfFiles',
        newValue: JSON.stringify(formattedFiles),
        storageArea: localStorage
      }));
    } catch (error) {
      console.error('Error saving files:', error);
    }
  }, [pdfFiles]);

  // Save events to localStorage whenever events changes
  useEffect(() => {
    try {
      localStorage.setItem('airads-events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  }, [events]);

  // Admin authentication
  const handleAdminLogin = () => {
    if (adminPassword === 'Tvet@upload') {
      setIsAdmin(true);
      setShowPasswordPrompt(false);
    } else {
      alert('Incorrect password. Access denied.');
    }
  };

  // Logout function
  const handleLogout = () => {
    setIsAdmin(false);
    setShowPasswordPrompt(true);
    setAdminPassword('');
    setActiveTab('dashboard');
    if (onLogout) {
      onLogout();
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Enhanced file upload with better progress handling
  const handleFileUpload = async (files, campusKey = null) => {
    if (!campusKey && !selectedCampus) {
      alert('Please select a campus before uploading files.');
      return;
    }
    
    const targetCampus = campusKey || selectedCampus;
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      if (file.type === 'application/pdf') {
        try {
          // Show immediate upload start
          setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
          
          const reader = new FileReader();
          
          reader.onprogress = (e) => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 90); // Reserve 10% for processing
              setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
            }
          };
          
          reader.onload = (e) => {
            try {
              const base64Data = e.target.result;
              
              // Find the expected file name for this campus
              const expectedFile = expectedFiles.find(ef => ef.campus === targetCampus);
              const fileName = expectedFile ? expectedFile.name : file.name;
              
              // Complete the upload
              setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
              
              setPdfFiles(prev => ({
                ...prev,
                [fileName]: {
                  name: fileName,
                  data: base64Data,
                  size: file.size,
                  uploadDate: new Date().toISOString(),
                  type: file.type,
                  campus: targetCampus
                }
              }));

              // Clear progress after a short delay
              setTimeout(() => {
                setUploadProgress(prev => {
                  const newProgress = { ...prev };
                  delete newProgress[file.name];
                  return newProgress;
                });
              }, 1500);
              
            } catch (error) {
              console.error('Error processing file:', error);
              alert(`Error processing ${file.name}. Please try again.`);
              setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[file.name];
                return newProgress;
              });
            }
          };
          
          reader.onerror = () => {
            console.error('Error reading file:', file.name);
            alert(`Error reading ${file.name}. Please try again.`);
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[file.name];
              return newProgress;
            });
          };
          
          // Start reading the file
          reader.readAsDataURL(file);
          
        } catch (error) {
          console.error('Error uploading file:', error);
          alert(`Error uploading ${file.name}. Please try again.`);
        }
      } else {
        alert(`File ${file.name} is not a PDF. Only PDF files are allowed.`);
      }
    }
  };

  // Handle image upload for events
  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (activeTab === 'files') {
        handleFileUpload(e.dataTransfer.files);
      }
    }
  };

  // Delete file
  const handleDeleteFile = (fileName) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      setPdfFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[fileName];
        return newFiles;
      });
    }
  };

  // Event management functions
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      let imageData = null;
      if (newEvent.image) {
        imageData = await handleImageUpload(newEvent.image);
      }

      const event = {
        id: Date.now(),
        ...newEvent,
        image: imageData,
        createdAt: new Date().toISOString()
      };

      setEvents(prev => [event, ...prev]);
      setNewEvent({ title: '', description: '', date: '', type: 'event', image: null });
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event. Please try again.');
    }
  };

  const handleEditEvent = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setEditingEvent({ ...event });
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent.title || !editingEvent.description || !editingEvent.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      let imageData = editingEvent.image;
      if (editingEvent.newImage) {
        imageData = await handleImageUpload(editingEvent.newImage);
      }

      setEvents(prev => 
        prev.map(event => 
          event.id === editingEvent.id 
            ? { ...editingEvent, image: imageData, updatedAt: new Date().toISOString() }
            : event
        )
      );
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event. Please try again.');
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  // Preview file
  const handlePreviewFile = (fileName) => {
    const file = pdfFiles[fileName];
    if (file) {
      setPreviewFile(file);
    }
  };

  // Clear all files
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all uploaded files? This action cannot be undone.')) {
      setPdfFiles({});
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get upload status for each expected file
  const getFileStatus = (expectedFileName) => {
    return pdfFiles[expectedFileName] ? 'uploaded' : 'missing';
  };

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart, color: '#2563eb' },
    { id: 'files', label: 'PDF Management', icon: Description, color: '#16a34a' },
    { id: 'events', label: 'Events Management', icon: CalendarToday, color: '#ef4444' }
  ];

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  }), [darkMode]);

  if (showPasswordPrompt) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: darkMode
              ? 'linear-gradient(to bottom right, #111827, #1f2937, #111827)'
              : 'linear-gradient(to bottom right, #60a5fa, #f1f5f9, #f87171)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Head title="Admin Access - AIRADS College" />
          <Paper
            sx={{
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              p: 4,
              width: '100%',
              maxWidth: '448px',
            }}
          >
            <Stack alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Box
                sx={{
                  mx: 'auto',
                  mb: 2,
                  p: 1.5,
                  background: 'linear-gradient(to right, #3b82f6, #ef4444)',
                  borderRadius: '50%',
                  color: '#fff',
                  display: 'inline-flex',
                }}
              >
                <UploadFile sx={{ height: 32, width: 32 }} />
              </Box>
              <Typography variant="h5" fontWeight="bold">
                Admin Access Required
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter admin password to manage content
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                  Admin Password
                </Typography>
                <TextField
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter password"
                  fullWidth
                  size="small"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </Box>
              <Button
                onClick={handleAdminLogin}
                variant="contained"
                fullWidth
                sx={{
                  background: 'linear-gradient(to right, #3b82f6, #ef4444)',
                  color: '#fff',
                  py: 1.5,
                  fontWeight: 500,
                  '&:hover': {
                    background: 'linear-gradient(to right, #2563eb, #dc2626)',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                  },
                }}
              >
                Access Admin Panel
              </Button>
              <Button
                onClick={toggleDarkMode}
                variant="outlined"
                fullWidth
                startIcon={darkMode ? <LightMode sx={{ height: 16, width: 16 }} /> : <DarkMode sx={{ height: 16, width: 16 }} />}
                sx={{ py: 1 }}
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </Stack>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  const gradientBg = darkMode
    ? 'linear-gradient(to bottom right, #111827, #1f2937, #111827)'
    : 'linear-gradient(to bottom right, #eff6ff, #f8fafc, #fef2f2)';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', background: gradientBg }}>
        <Head title="Upload - AIRADS College" />
        {/* Sidebar */}
        <Box
          sx={{
            width: sidebarOpen ? 256 : 80,
            bgcolor: 'background.paper',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            transition: 'width 300ms',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}
        >
          {/* Sidebar Header */}
          <Box
            sx={{
              p: 3,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" sx={{ justifyContent: !sidebarOpen ? 'center' : 'flex-start' }}>
                <Box
                  sx={{
                    p: 1,
                    background: 'linear-gradient(to right, #3b82f6, #ef4444)',
                    borderRadius: '8px',
                    color: '#fff',
                    display: 'flex',
                  }}
                >
                  <UploadFile sx={{ height: 24, width: 24 }} />
                </Box>
                {sidebarOpen && (
                  <Box sx={{ ml: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      AIRADS
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Admin Panel
                    </Typography>
                  </Box>
                )}
              </Stack>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={toggleDarkMode}
                  size="small"
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? <LightMode sx={{ height: 16, width: 16, color: '#eab308' }} /> : <DarkMode sx={{ height: 16, width: 16, color: '#4b5563' }} />}
                </IconButton>
                <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} size="small">
                  <Menu sx={{ height: 16, width: 16 }} color="action" />
                </IconButton>
              </Stack>
            </Stack>
          </Box>

          {/* Sidebar Navigation */}
          <Box sx={{ flex: 1, p: 2 }}>
            <Stack spacing={1}>
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    fullWidth
                    sx={{
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      px: 2,
                      py: 1.5,
                      borderRadius: '8px',
                      textTransform: 'none',
                      minWidth: 0,
                      background: activeTab === item.id
                        ? 'linear-gradient(to right, #3b82f6, #ef4444)'
                        : 'transparent',
                      color: activeTab === item.id ? '#fff' : 'text.secondary',
                      boxShadow: activeTab === item.id ? '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' : 'none',
                      '&:hover': {
                        bgcolor: activeTab === item.id ? undefined : 'action.hover',
                      },
                    }}
                  >
                    <IconComponent
                      sx={{
                        height: 20,
                        width: 20,
                        mr: sidebarOpen ? 1.5 : 0,
                        color: activeTab === item.id ? '#fff' : item.color,
                      }}
                    />
                    {sidebarOpen && (
                      <Typography fontWeight={500}>{item.label}</Typography>
                    )}
                  </Button>
                );
              })}
            </Stack>
          </Box>

          {/* Sidebar Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Button
              onClick={handleLogout}
              variant="contained"
              fullWidth
              sx={{
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                bgcolor: '#ef4444',
                '&:hover': { bgcolor: '#dc2626' },
                textTransform: 'none',
                py: 1.5,
                borderRadius: '8px',
                minWidth: 0,
              }}
              startIcon={<Logout sx={{ height: 16, width: 16 }} />}
            >
              {sidebarOpen && 'Logout'}
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper
              sx={{
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                p: 3,
                mb: 4,
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {sidebarItems.find(item => item.id === activeTab)?.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Content Management System
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">
                    Welcome Admin
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} color="success.main">
                    {Object.keys(pdfFiles).length}/6 Files &bull; {events.length} Events
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <>
                {/* Stats Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
                  <Paper sx={{ borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', p: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Box sx={{ p: 1.5, background: 'linear-gradient(to right, #3b82f6, #2563eb)', borderRadius: '8px', color: '#fff', display: 'flex' }}>
                        <Description sx={{ height: 24, width: 24 }} />
                      </Box>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        {Object.keys(pdfFiles).length}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle1" fontWeight={600}>Uploaded Forms</Typography>
                    <Typography variant="caption" color="text.secondary">Out of 6 campuses</Typography>
                  </Paper>

                  <Paper sx={{ borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', p: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Box sx={{ p: 1.5, background: 'linear-gradient(to right, #ef4444, #dc2626)', borderRadius: '8px', color: '#fff', display: 'flex' }}>
                        <CalendarToday sx={{ height: 24, width: 24 }} />
                      </Box>
                      <Typography variant="h5" fontWeight="bold" color="error">
                        {events.length}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle1" fontWeight={600}>Total Events</Typography>
                    <Typography variant="caption" color="text.secondary">Published events</Typography>
                  </Paper>

                  <Paper sx={{ borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', p: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Box sx={{ p: 1.5, background: 'linear-gradient(to right, #22c55e, #16a34a)', borderRadius: '8px', color: '#fff', display: 'flex' }}>
                        <People sx={{ height: 24, width: 24 }} />
                      </Box>
                      <Typography variant="h5" fontWeight="bold" color="success.main">
                        6
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle1" fontWeight={600}>Total Campuses</Typography>
                    <Typography variant="caption" color="text.secondary">Active locations</Typography>
                  </Paper>

                  <Paper sx={{ borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', p: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Box sx={{ p: 1.5, background: 'linear-gradient(to right, #a855f7, #9333ea)', borderRadius: '8px', color: '#fff', display: 'flex' }}>
                        <Folder sx={{ height: 24, width: 24 }} />
                      </Box>
                      <Typography variant="h5" fontWeight="bold" color="secondary">
                        {Math.round((Object.keys(pdfFiles).length / 6) * 100)}%
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle1" fontWeight={600}>Completion</Typography>
                    <Typography variant="caption" color="text.secondary">Forms uploaded</Typography>
                  </Paper>
                </Box>

                {/* Campus Status Overview */}
                <Paper sx={{ borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Campus Forms Status
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                    {expectedFiles.map((file, index) => {
                      const status = getFileStatus(file.name);
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: '8px',
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: status === 'uploaded' ? 'success.main' : 'error.main',
                              }}
                            />
                            <Typography fontWeight={500}>{file.displayName}</Typography>
                          </Stack>
                          <Chip
                            label={status === 'uploaded' ? 'Ready' : 'Missing'}
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              bgcolor: status === 'uploaded' ? '#dcfce7' : '#fee2e2',
                              color: status === 'uploaded' ? '#166534' : '#991b1b',
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>
              </>
            )}

            {/* PDF Management Tab */}
            {activeTab === 'files' && (
              <>
                {/* Upload Section */}
                <Paper sx={{ borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', p: 3, mb: 4 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Upload Application Form PDFs
                  </Typography>

                  {/* Campus Selector */}
                  <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Select Campus *</InputLabel>
                      <Select
                        value={selectedCampus}
                        onChange={(e) => setSelectedCampus(e.target.value)}
                        label="Select Campus *"
                      >
                        <MenuItem value="">Choose a campus...</MenuItem>
                        {expectedFiles.map((file) => (
                          <MenuItem key={file.campus} value={file.campus}>
                            {file.displayName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      border: '2px dashed',
                      borderRadius: '12px',
                      p: 4,
                      textAlign: 'center',
                      transition: 'all 0.15s',
                      borderColor: dragActive
                        ? 'primary.main'
                        : selectedCampus
                          ? 'success.main'
                          : 'divider',
                      bgcolor: dragActive
                        ? (darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff')
                        : 'transparent',
                      '&:hover': {
                        borderColor: selectedCampus ? 'success.main' : 'primary.main',
                      },
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <UploadFile
                      sx={{
                        height: 48,
                        width: 48,
                        mx: 'auto',
                        mb: 2,
                        color: selectedCampus ? 'success.main' : 'text.secondary',
                      }}
                    />
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                      {dragActive
                        ? 'Drop files here'
                        : selectedCampus
                          ? `Upload for ${expectedFiles.find(f => f.campus === selectedCampus)?.displayName}`
                          : 'Select Campus First'
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedCampus
                        ? 'Upload PDF application form for the selected campus'
                        : 'Please select a campus before uploading files'
                      }
                    </Typography>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      style={{ display: 'none' }}
                      id="file-upload"
                      disabled={!selectedCampus}
                    />
                    <Button
                      onClick={() => selectedCampus && document.getElementById('file-upload').click()}
                      disabled={!selectedCampus}
                      variant="contained"
                      sx={{
                        background: selectedCampus
                          ? 'linear-gradient(to right, #3b82f6, #ef4444)'
                          : undefined,
                        color: '#fff',
                        px: 3,
                        py: 1.5,
                        fontWeight: 500,
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': {
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      {selectedCampus ? 'Select PDF Files' : 'Select Campus First'}
                    </Button>
                  </Box>

                  {/* Upload Progress */}
                  {Object.keys(uploadProgress).length > 0 && (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      {Object.entries(uploadProgress).map(([fileName, progress]) => (
                        <Box
                          key={fileName}
                          sx={{
                            bgcolor: darkMode ? 'grey.800' : 'grey.50',
                            borderRadius: '8px',
                            p: 1.5,
                          }}
                        >
                          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight={500}>
                              {fileName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {progress}%
                            </Typography>
                          </Stack>
                          <Box sx={{ width: '100%', bgcolor: darkMode ? 'grey.700' : 'grey.200', borderRadius: '9999px', height: 8 }}>
                            <Box
                              sx={{
                                background: 'linear-gradient(to right, #3b82f6, #ef4444)',
                                height: 8,
                                borderRadius: '9999px',
                                transition: 'all 0.3s',
                                width: `${progress}%`,
                              }}
                            />
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Paper>

                {/* Campus Files Status */}
                <Paper sx={{ borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', p: 3, mb: 4 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Campus Application Forms Status
                    </Typography>
                    {Object.keys(pdfFiles).length > 0 && (
                      <Button
                        onClick={handleClearAll}
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<Delete sx={{ height: 16, width: 16 }} />}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontSize: '0.875rem',
                        }}
                      >
                        Clear All
                      </Button>
                    )}
                  </Stack>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
                    {expectedFiles.map((file, index) => {
                      const status = getFileStatus(file.name);
                      const uploadedFile = pdfFiles[file.name];
                      const isBlue = file.color.includes('blue');

                      return (
                        <Box
                          key={index}
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: '12px',
                            p: 2,
                            '&:hover': {
                              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              background: isBlue
                                ? 'linear-gradient(to right, #60a5fa, #2563eb)'
                                : 'linear-gradient(to right, #f87171, #dc2626)',
                              color: '#fff',
                              p: 1.5,
                              borderRadius: '8px',
                              mb: 1.5,
                            }}
                          >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Description sx={{ height: 20, width: 20 }} />
                              {status === 'uploaded' ? (
                                <CheckCircle sx={{ height: 20, width: 20, color: '#86efac' }} />
                              ) : (
                                <Error sx={{ height: 20, width: 20, color: '#fde047' }} />
                              )}
                            </Stack>
                            <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>
                              {file.displayName}
                            </Typography>
                          </Box>

                          <Stack spacing={1}>
                            <Typography variant="body2" fontWeight={500}>
                              {file.name}
                            </Typography>
                            {uploadedFile ? (
                              <Stack spacing={1}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                  <Typography variant="caption" color="text.secondary">
                                    {formatFileSize(uploadedFile.size)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(uploadedFile.uploadDate).toLocaleDateString()}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    onClick={() => handlePreviewFile(file.name)}
                                    variant="contained"
                                    size="small"
                                    fullWidth
                                    startIcon={<Visibility sx={{ height: 12, width: 12 }} />}
                                    sx={{
                                      bgcolor: '#3b82f6',
                                      '&:hover': { bgcolor: '#2563eb' },
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      borderRadius: '4px',
                                      py: 0.5,
                                    }}
                                  >
                                    Preview
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteFile(file.name)}
                                    variant="contained"
                                    size="small"
                                    fullWidth
                                    startIcon={<Delete sx={{ height: 12, width: 12 }} />}
                                    sx={{
                                      bgcolor: '#ef4444',
                                      '&:hover': { bgcolor: '#dc2626' },
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      borderRadius: '4px',
                                      py: 0.5,
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Stack>
                              </Stack>
                            ) : (
                              <Box sx={{ textAlign: 'center', py: 1 }}>
                                <Typography variant="caption" color="error" fontWeight={500}>
                                  Not Uploaded
                                </Typography>
                                <Button
                                  onClick={() => {
                                    setSelectedCampus(file.campus);
                                    document.getElementById('file-upload').click();
                                  }}
                                  variant="contained"
                                  size="small"
                                  fullWidth
                                  sx={{
                                    mt: 1,
                                    bgcolor: '#3b82f6',
                                    '&:hover': { bgcolor: '#2563eb' },
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    borderRadius: '4px',
                                    py: 0.5,
                                  }}
                                >
                                  Upload Now
                                </Button>
                              </Box>
                            )}
                          </Stack>
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>
              </>
            )}

            {/* Events Management Tab */}
            {activeTab === 'events' && (
              <>
                {/* Add New Event */}
                <Paper sx={{ borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', p: 3, mb: 4 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Add New Event
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Stack spacing={2}>
                      <TextField
                        label="Title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Event title"
                        fullWidth
                        size="small"
                        required
                      />
                      <TextField
                        label="Date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        fullWidth
                        size="small"
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                      <FormControl fullWidth size="small">
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={newEvent.type}
                          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                          label="Type"
                        >
                          <MenuItem value="event">Event</MenuItem>
                          <MenuItem value="news">News</MenuItem>
                          <MenuItem value="holiday">Holiday</MenuItem>
                          <MenuItem value="announcement">Announcement</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack spacing={2}>
                      <TextField
                        label="Description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        multiline
                        rows={4}
                        fullWidth
                        size="small"
                        required
                        placeholder="Event description"
                      />
                      <Box>
                        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                          Image
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewEvent({ ...newEvent, image: e.target.files[0] })}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid',
                            borderColor: darkMode ? '#4b5563' : '#d1d5db',
                            borderRadius: '8px',
                            background: darkMode ? '#374151' : '#fff',
                            color: darkMode ? '#f3f4f6' : '#1f2937',
                            fontSize: '0.875rem',
                          }}
                        />
                      </Box>
                    </Stack>
                  </Box>
                  <Button
                    onClick={handleAddEvent}
                    variant="contained"
                    startIcon={<Add sx={{ height: 16, width: 16 }} />}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(to right, #3b82f6, #ef4444)',
                      color: '#fff',
                      px: 3,
                      py: 1.5,
                      fontWeight: 500,
                      borderRadius: '8px',
                      textTransform: 'none',
                      '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    Add Event
                  </Button>
                </Paper>

                {/* Events List */}
                <Paper sx={{ borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Manage Events ({events.length})
                  </Typography>
                  {events.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <CalendarToday sx={{ height: 48, width: 48, mx: 'auto', mb: 2, color: '#d1d5db' }} />
                      <Typography color="text.secondary">
                        No events posted yet. Add your first event above.
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      {events.map((event) => (
                        <Box
                          key={event.id}
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: '8px',
                            p: 2,
                            '&:hover': {
                              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          {editingEvent && editingEvent.id === event.id ? (
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                              <Stack spacing={1.5}>
                                <TextField
                                  value={editingEvent.title}
                                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                  size="small"
                                  fullWidth
                                />
                                <TextField
                                  type="date"
                                  value={editingEvent.date}
                                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                                  size="small"
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                                <FormControl fullWidth size="small">
                                  <InputLabel>Type</InputLabel>
                                  <Select
                                    value={editingEvent.type}
                                    onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                                    label="Type"
                                  >
                                    <MenuItem value="event">Event</MenuItem>
                                    <MenuItem value="news">News</MenuItem>
                                    <MenuItem value="holiday">Holiday</MenuItem>
                                    <MenuItem value="announcement">Announcement</MenuItem>
                                  </Select>
                                </FormControl>
                              </Stack>
                              <Stack spacing={1.5}>
                                <TextField
                                  value={editingEvent.description}
                                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                                  multiline
                                  rows={3}
                                  size="small"
                                  fullWidth
                                />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setEditingEvent({ ...editingEvent, newImage: e.target.files[0] })}
                                  style={{
                                    width: '100%',
                                    padding: '6px 8px',
                                    border: '1px solid',
                                    borderColor: darkMode ? '#4b5563' : '#d1d5db',
                                    borderRadius: '4px',
                                    background: darkMode ? '#374151' : '#fff',
                                    color: darkMode ? '#f3f4f6' : '#1f2937',
                                    fontSize: '0.875rem',
                                  }}
                                />
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    onClick={handleUpdateEvent}
                                    variant="contained"
                                    size="small"
                                    startIcon={<Save sx={{ height: 12, width: 12 }} />}
                                    sx={{
                                      bgcolor: '#16a34a',
                                      '&:hover': { bgcolor: '#15803d' },
                                      textTransform: 'none',
                                      fontSize: '0.875rem',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => setEditingEvent(null)}
                                    variant="contained"
                                    size="small"
                                    sx={{
                                      bgcolor: '#6b7280',
                                      '&:hover': { bgcolor: '#4b5563' },
                                      textTransform: 'none',
                                      fontSize: '0.875rem',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Stack>
                              </Stack>
                            </Box>
                          ) : (
                            <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                              <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                                {event.image && (
                                  <Box
                                    component="img"
                                    src={event.image}
                                    alt={event.title}
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      objectFit: 'cover',
                                      borderRadius: '8px',
                                    }}
                                  />
                                )}
                                <Box sx={{ flex: 1 }}>
                                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                      {event.title}
                                    </Typography>
                                    <Chip
                                      label={event.type}
                                      size="small"
                                      sx={{
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        bgcolor:
                                          event.type === 'event' ? '#dbeafe' :
                                          event.type === 'news' ? '#dcfce7' :
                                          event.type === 'holiday' ? '#fee2e2' :
                                          '#f3e8ff',
                                        color:
                                          event.type === 'event' ? '#1e40af' :
                                          event.type === 'news' ? '#166534' :
                                          event.type === 'holiday' ? '#991b1b' :
                                          '#6b21a8',
                                      }}
                                    />
                                  </Stack>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {event.description}
                                  </Typography>
                                  <Stack direction="row" spacing={2}>
                                    <Typography variant="caption" color="text.secondary">
                                      &#128197; {new Date(event.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      &#128338; {new Date(event.createdAt).toLocaleDateString()}
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Stack>
                              <Stack direction="row" spacing={1}>
                                <Button
                                  onClick={() => handleEditEvent(event.id)}
                                  variant="contained"
                                  size="small"
                                  startIcon={<Edit sx={{ height: 12, width: 12 }} />}
                                  sx={{
                                    bgcolor: '#3b82f6',
                                    '&:hover': { bgcolor: '#2563eb' },
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    borderRadius: '4px',
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  variant="contained"
                                  size="small"
                                  startIcon={<Delete sx={{ height: 12, width: 12 }} />}
                                  sx={{
                                    bgcolor: '#ef4444',
                                    '&:hover': { bgcolor: '#dc2626' },
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    borderRadius: '4px',
                                  }}
                                >
                                  Delete
                                </Button>
                              </Stack>
                            </Stack>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Paper>
              </>
            )}

            {/* PDF Preview Modal */}
            <Dialog
              open={!!previewFile}
              onClose={() => setPreviewFile(null)}
              maxWidth="lg"
              fullWidth
            >
              {previewFile && (
                <>
                  <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {previewFile.name}
                    </Typography>
                    <IconButton
                      onClick={() => setPreviewFile(null)}
                      size="small"
                    >
                      <Close sx={{ height: 24, width: 24 }} />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent sx={{ p: 2 }}>
                    <Box
                      component="iframe"
                      src={previewFile.data}
                      sx={{
                        width: '100%',
                        height: 384,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                      title={`Preview of ${previewFile.name}`}
                    />
                  </DialogContent>
                </>
              )}
            </Dialog>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default UploadPage;
