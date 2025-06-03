import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Pagination from '@mui/material/Pagination';
import { styled, alpha, useTheme } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme.jsx';
import { keyframes } from '@emotion/react';
import Footer from "../../components/Footer.jsx";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArticleIcon from '@mui/icons-material/Article';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

const gridLineGlow = keyframes`0% { opacity: 0.05; } 50% { opacity: 0.1; } 100% { opacity: 0.05; }`;

const gridBackgroundStyles = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, backgroundSize: '60px 60px',
    backgroundImage: `linear-gradient(to right, rgba(138, 43, 226, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(138, 43, 226, 0.04) 1px, transparent 1px)`,
    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 30%, rgba(138, 43, 226, 0.08), transparent 60%)', animation: `${gridLineGlow} 5s infinite ease-in-out`},
    '&::after': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(18, 9, 29, 0.98) 0%, rgba(10, 5, 18, 1) 100%)', zIndex: -2},
};

const StyledTextField = styled(TextField)(({ theme, ownerState }) => ({
    width: '100%',
    '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.6)',
        zIndex: 1,
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#c67eff',
    },
    '& .MuiOutlinedInput-root': {
        color: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        alignItems: ownerState?.multiline
            ? (ownerState.textValue && ownerState.textValue.includes('\n') ? 'flex-start' : 'center')
            : 'center',
        '& fieldset': {
            borderColor: 'rgba(138, 43, 226, 0.3)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(198, 126, 255, 0.7)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#c67eff',
            boxShadow: `0 0 0 3px ${alpha("#c67eff", 0.35)}`,
        },
        '& .MuiInputBase-input': {
            color: 'rgba(255, 255, 255, 0.9)',
            padding: '0 !important',
            width: '100%',
            boxSizing: 'border-box',
            lineHeight: 1.5,
            '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
                opacity: 1,
            },
        },
        '& textarea.MuiInputBase-input': {
            overflowY: 'auto',
            resize: 'none',
            maxHeight: '40px',
        },
    },
}));

const PostCardStyled = styled(Card)(({ theme }) => ({
    width: '100%',
    backgroundColor: 'hsl(220, 30%, 6%)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(138, 43, 226, 0.2)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
    color: 'rgba(255, 255, 255, 0.9)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 12px 40px rgba(138, 43, 226, 0.2), 0 0 20px ${alpha("#c67eff", 0.15)}`,
    },
}));

const ModalContentBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 700,
    maxHeight: '85vh',
    backgroundColor: 'hsl(240, 30%, 6%) !important',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(138, 43, 226, 0.4)',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    padding: 0,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    minWidth: 130,
    '& .MuiOutlinedInput-root': {
        color: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.4)' },
        '&:hover fieldset': { borderColor: 'rgba(198, 126, 255, 0.8)', backgroundColor: alpha(theme.palette.info.light, 0.1) },
        '&.Mui-focused fieldset': { borderColor: '#c67eff' },
        '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' }
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.6)'},
    '& .MuiInputLabel-root.Mui-focused': { color: '#c67eff'}
}));

const POST_TYPES = [
    { value: 'text', label: 'Текст/Думка', IconComponent: LightbulbOutlinedIcon },
    { value: 'question', label: 'Питання', IconComponent: HelpOutlineIcon },
    { value: 'article', label: 'Стаття/Новина', IconComponent: ArticleIcon },
    { value: 'achievement', label: 'Досягнення', IconComponent: EmojiEventsIcon },
];

const MAX_POST_LENGTH = 1500;
const POSTS_PER_PAGE = 10;

const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffSeconds < 60) return `${diffSeconds} сек тому`;
    if (diffMinutes < 60) return `${diffMinutes} хв тому`;
    if (diffHours < 24) return `${diffHours} год тому`;
    if (diffDays === 1) return `Вчора, ${date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' }) + ` о ${date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}`;
};

function CommunityPage(props) {
    const theme = useTheme();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState(null);
    const [authChecked, setAuthChecked] = React.useState(false);
    const [anchorElPostMenu, setAnchorElPostMenu] = React.useState(null);
    const [selectedPostForMenu, setSelectedPostForMenu] = React.useState(null);
    const [posts, setPosts] = React.useState([]);
    const [comments, setComments] = React.useState({});
    const [newPostText, setNewPostText] = React.useState("");
    const [newPostType, setNewPostType] = React.useState('text');
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [previewMediaUrl, setPreviewMediaUrl] = React.useState(null);
    const [previewMediaType, setPreviewMediaType] = React.useState(null);
    const [openCommentsModal, setOpenCommentsModal] = React.useState(false);
    const [selectedPostForComment, setSelectedPostForComment] = React.useState(null);
    const [newCommentText, setNewCommentText] = React.useState("");
    const [searchTerm, setSearchTerm] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        let isMounted = true; // Для запобігання оновленню стану на розмонтованому компоненті

        const initializeAuth = async () => {
            setAuthChecked(false); // Починаємо перевірку
            const userIdFromStorage = localStorage.getItem('userId'); // Або ваш метод отримання токена/ID

            if (userIdFromStorage) {
                try {
                    // Запит для отримання повних даних користувача
                    const response = await fetch(`/api/profile/${userIdFromStorage}`);
                    if (!response.ok) {
                        // Якщо токен/ID невалідний або сесія застаріла
                        localStorage.removeItem('userId'); // Очистити невалідний ID
                        if (isMounted) {
                            setIsAuthenticated(false);
                            setCurrentUser(null);
                        }
                        throw new Error('Не вдалося завантажити дані користувача, сесія може бути недійсною.');
                    }
                    const userData = await response.json();
                    if (isMounted) {
                        setCurrentUser({
                            id: userData.userId,
                            name: userData.name,
                            avatarUrl: userData.avatarUrl || '/static/images/avatar/default.jpg'
                        });
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Помилка ініціалізації автентифікації або завантаження профілю:', error);
                    localStorage.removeItem('userId'); // Очистити потенційно невалідний ID
                    if (isMounted) {
                        setIsAuthenticated(false);
                        setCurrentUser(null);
                    }
                }
            } else {
                // Користувач не має збереженого ID
                if (isMounted) {
                    setIsAuthenticated(false);
                    setCurrentUser(null);
                }
            }
            if (isMounted) {
                setAuthChecked(true); // Перевірка автентифікації завершена
            }
        };

        initializeAuth();

        return () => {
            isMounted = false; // Очистка при розмонтуванні
        };
    }, []); // Пустий масив залежностей, щоб виконати один раз

    const handleOpenPostMenu = (event, post) => { setAnchorElPostMenu(event.currentTarget); setSelectedPostForMenu(post); };
    const handleClosePostMenu = () => { setAnchorElPostMenu(null); setSelectedPostForMenu(null); };

    const clearPreviewMedia = () => {
        if (previewMediaUrl && previewMediaUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewMediaUrl);
        }
        setSelectedFile(null);
        setPreviewMediaUrl(null);
        setPreviewMediaType(null);
        const fileInput = document.getElementById('file-input-for-post');
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleFileChange = (event) => {
        if (previewMediaUrl && previewMediaUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewMediaUrl);
        }
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewMediaUrl(objectUrl);
            setPreviewMediaType(file.type);
        } else {
            clearPreviewMedia();
        }
    };

    const fetchPosts = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const response = await fetch(`/api/posts?page=${page}&limit=${POSTS_PER_PAGE}&searchTerm=${encodeURIComponent(search)}&userId=${currentUser?.id || ''}`);
            if (!response.ok) throw new Error('Помилка завантаження постів');
            const data = await response.json();
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Fetch comments error response:', errorData);
                throw new Error(errorData.message || 'Помилка завантаження коментарів');
            }
            const data = await response.json();
            setComments(prev => ({ ...prev, [postId]: data }));
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments(prev => ({ ...prev, [postId]: [] }));
        }
    };

    const handleCreatePost = async () => {
        if (!newPostText.trim() && !selectedFile) return;
        if (!currentUser?.id) {
            alert('Помилка: користувач не авторизований.');
            return;
        }

        const formData = new FormData();
        formData.append('userId', currentUser.id);
        formData.append('text', newPostText);
        formData.append('type', newPostType);
        if (selectedFile) {
            formData.append('media', selectedFile);
        }

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Create post error response:', errorData);
                throw new Error(errorData.message || 'Помилка створення поста');
            }
            const { post } = await response.json();
            setPosts(prev => [post, ...prev]);
            setNewPostText("");
            setNewPostType('text');
            clearPreviewMedia();
            if (currentPage !== 1) setCurrentPage(1);
        } catch (error) {
            console.error('Error creating post:', error);
            alert(`Не вдалося створити пост: ${error.message}`);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!isAuthenticated || !currentUser) return;
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id })
            });
            if (!response.ok) throw new Error('Помилка видалення поста');
            setPosts(prev => prev.filter(post => post.id !== postId));
            setComments(prev => {
                const newComments = { ...prev };
                delete newComments[postId];
                return newComments;
            });
            handleClosePostMenu();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Не вдалося видалити пост.');
        }
    };

    const handleReportPost = async (postId) => {
        if (!isAuthenticated || !currentUser) return;
        try {
            const response = await fetch(`/api/posts/${postId}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id })
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Report post error response:', errorData);
                throw new Error(errorData.message || 'Помилка надсилання скарги');
            }
            alert('Скарга на пост надіслана.');
            handleClosePostMenu();
        } catch (error) {
            console.error('Error reporting post:', error);
            alert(`Не вдалося надіслати скаргу: ${error.message}`);
        }
    };

    const handleLikePost = async (postId) => {
        if (!isAuthenticated || !currentUser) return;
        try {
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id })
            });
            if (!response.ok) {
                const errorData = await response.json(); // Отримуємо деталі помилки
                console.error('Like post error response:', errorData);
                throw new Error(errorData.message || 'Помилка обробки лайка');
            }
            const { likes, likedByUser } = await response.json();
            setPosts(prev => prev.map(post => post.id === postId ? { ...post, likes, likedByUser } : post));
        } catch (error) {
            console.error('Error liking post:', error);
            alert(`Не вдалося обробити лайк: ${error.message}`);
        }
    };

    const handleOpenComments = async (post) => {
        setSelectedPostForComment(post);
        await fetchComments(post.id);
        setOpenCommentsModal(true);
    };

    const handleCloseCommentsModal = () => {
        setOpenCommentsModal(false);
        setSelectedPostForComment(null);
        setNewCommentText("");
    };

    const handlePostComment = async () => {
        if (!newCommentText.trim() || !selectedPostForComment) return;

        try {
            const response = await fetch(`/api/posts/${selectedPostForComment.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser?.id,
                    text: newCommentText
                })
            });
            if (!response.ok) throw new Error('Помилка створення коментаря');
            const { comment } = await response.json();
            setComments(prev => ({
                ...prev,
                [selectedPostForComment.id]: [...(prev[selectedPostForComment.id] || []), comment]
            }));
            setPosts(prev => prev.map(p => p.id === selectedPostForComment.id ? { ...p, commentsCount: (prev[selectedPostForComment.id]?.length || 0) + 1 } : p));
            setNewCommentText("");
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Не вдалося створити коментар.');
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!isAuthenticated || !currentUser) return;
        try {
            const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id })
            });
            if (!response.ok) throw new Error('Помилка видалення коментаря');
            setComments(prev => ({
                ...prev,
                [postId]: prev[postId].filter(c => c.id !== commentId)
            }));
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: (prev[postId]?.length || 1) - 1 } : p));
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Не вдалося видалити коментар.');
        }
    };

    const handleSharePost = (postId) => {
        const postUrl = `${window.location.origin}${location.pathname}#post-${postId}`;
        navigator.clipboard.writeText(postUrl)
            .then(() => alert(`Посилання на пост скопійовано: ${postUrl}`))
            .catch(err => console.error('Failed to copy URL: ', err));
    };

    const getPostTypeIconElement = (type) => {
        const typeInfo = POST_TYPES.find(pt => pt.value === type);
        if (typeInfo && typeInfo.IconComponent) {
            const Icon = typeInfo.IconComponent;
            return <Icon sx={{ color: alpha(theme.palette.primary.light, 0.7), mr: 1, fontSize: '1.3rem' }} />;
        }
        return null;
    };

    const filteredPosts = posts.filter(post => {
        const searchTermLower = searchTerm.toLowerCase();
        const textMatch = post.text.toLowerCase().includes(searchTermLower);
        const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(searchTermLower));
        const authorName = post.isAnonymous ? "" : post.author?.name || "";
        const authorMatch = authorName.toLowerCase().includes(searchTermLower);
        return textMatch || tagMatch || authorMatch;
    });

    const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
    const pageCount = Math.max(totalPages, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

    React.useEffect(() => {
        if (authChecked) { // Тільки після завершення початкової перевірки автентифікації
            if (isAuthenticated && currentUser?.id) {
                // currentUser вже має бути повністю завантажений функцією initializeAuth
                fetchPosts(currentPage, searchTerm);
            } else if (!isAuthenticated) {
                setPosts([]); // Очистити пости
                setTotalPages(1);
                setCurrentPage(1);
                setLoading(false);
                console.log("Користувач не автентифікований, завантаження постів скасовано/очищено.");
            }
        }
    }, [currentPage, searchTerm, isAuthenticated, currentUser?.id, authChecked]);

    React.useEffect(() => {
        if (currentPage > pageCount && pageCount > 0) {
            setCurrentPage(pageCount);
        } else if (filteredPosts.length > 0 && currentPage === 0 && pageCount > 0) {
            setCurrentPage(1);
        }
    }, [filteredPosts.length, currentPage, pageCount]);

    React.useEffect(() => {
        const hash = location.hash;
        if (hash && hash.startsWith('#post-')) {
            const targetPostId = hash.substring('#post-'.length);
            const postIndex = filteredPosts.findIndex(p => p.id === targetPostId);

            if (postIndex !== -1) {
                const targetPage = Math.floor(postIndex / POSTS_PER_PAGE) + 1;
                if (currentPage !== targetPage) {
                    setCurrentPage(targetPage);
                } else {
                    const element = document.getElementById(`post-${targetPostId}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        }
    }, [location.hash, filteredPosts, currentPage]);

    React.useEffect(() => {
        const hash = location.hash;
        if (hash && hash.startsWith('#post-')) {
            const targetPostId = hash.substring('#post-'.length);
            if (paginatedPosts.some(p => p.id === targetPostId)) {
                const element = document.getElementById(`post-${targetPostId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    }, [location.hash, paginatedPosts]);

    const textFieldSx = (isMultiline, isComment = false, textValue = "") => ({
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'hsl(220, 30%, 6%) !important',
            minHeight: isMultiline ? (isComment ? '48px' : '64px') : '40px',
            alignItems: isMultiline ? (textValue && textValue.includes('\n') ? 'flex-start' : 'center') : 'center',
            paddingTop: isMultiline ? theme.spacing(1) : theme.spacing(0.75),
            paddingBottom: isMultiline ? theme.spacing(1) : theme.spacing(0.75),
        },
        '& .MuiOutlinedInput-root .MuiInputBase-input': {
            ...(isMultiline && {
                maxHeight: isComment ? '80px' : '150px',
                minHeight: isComment ? '20px' : '40px',
            })
        }
    });

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
                <Box sx={gridBackgroundStyles} />
                <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 }, position: 'relative', zIndex: 5, flexGrow: 1 }}>
                    <Typography variant="h1" component="h1" sx={{ textAlign: 'center', mb: 1, fontWeight: 'bold', fontSize: { xs: '3rem', sm: '3.8rem', md: '4.5rem' }, color: 'white', textShadow: '0 0 15px rgba(198, 126, 255, 0.4)' }}>Стрічка Спільноти</Typography>
                    <Typography variant="h3" component="p" sx={{ textAlign: 'center', mb: {xs:3, md:4, lg:7}, color: 'rgba(230, 220, 255, 0.85)', fontSize: { xs: '1.15rem', sm: '1.3rem', md: '1.45rem' }, fontWeight: '600' }}>Діліться думками, знаннями та досягненнями!</Typography>

                    <Paper sx={{ p: {xs: 2, sm: 2.5}, mb: {xs:3, md:4}, backgroundColor: 'hsl(220, 30%, 6%)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(138, 43, 226, 0.25)', boxShadow: '0 10px 35px rgba(0, 0, 0, 0.25)', }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
                            <Avatar
                                src={currentUser?.avatarUrl || "/static/images/avatar/default.jpg"}
                                sx={{ width: 48, height: 48, mt: theme.spacing(1), border: '2px solid rgba(198, 126, 255, 0.5)' }}
                            />
                            <StyledTextField
                                multiline
                                rows={3}
                                maxRows={6}
                                placeholder={currentUser ? `Що у вас на думці, ${currentUser.name.split(' ')[0]}?` : "Завантаження..."}                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value.slice(0, MAX_POST_LENGTH))}
                                helperText={`${newPostText.length}/${MAX_POST_LENGTH}`}
                                FormHelperTextProps={{sx: {textAlign:'right', color:'rgba(255,255,255,0.5)'}}}
                                ownerState={{ textValue: newPostText, multiline: true }}
                                sx={textFieldSx(true, false, newPostText)}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt:1 }}>
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                {previewMediaUrl && (
                                    <Tooltip title="Видалити медіа">
                                        <IconButton onClick={clearPreviewMedia} size="small" sx={{color: alpha(theme.palette.error.light,0.7), '&:hover': {backgroundColor: alpha(theme.palette.error.dark,0.15)}}}>
                                            <ClearIcon fontSize="small"/>
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <Tooltip title="Додати зображення/відео">
                                    <IconButton component="label" size="small" sx={{color: alpha(theme.palette.info.light,0.8), '&:hover': {backgroundColor: alpha(theme.palette.info.light,0.1)}}}>
                                        <AddPhotoAlternateIcon />
                                        <input id="file-input-for-post" type="file" hidden accept="image/*,video/*" onChange={handleFileChange} />
                                    </IconButton>
                                </Tooltip>
                                <StyledFormControl size="small" variant="outlined" sx={{minWidth: 150}}>
                                    <Select
                                        value={newPostType}
                                        onChange={(e) => setNewPostType(e.target.value)}
                                        renderValue={(selectedValue) => {
                                            const typeInfo = POST_TYPES.find(pt => pt.value === selectedValue);
                                            if (!typeInfo) return selectedValue;
                                            const Icon = typeInfo.IconComponent;
                                            return ( <Box sx={{ display: 'flex', alignItems: 'center' }}> <Icon sx={{ mr: 0.8, fontSize: '1.2rem', verticalAlign: 'middle', color: alpha(theme.palette.primary.light, 0.7) }} /> {typeInfo.label} </Box> );
                                        }}
                                        MenuProps={{ PaperProps: { sx: {backgroundColor: 'rgba(40,32,60,0.95)', backdropFilter: 'blur(10px)', color:'white', '& .MuiMenuItem-root:hover':{backgroundColor: alpha(theme.palette.secondary.main,0.15)}, '& .Mui-selected': {backgroundColor: `${alpha(theme.palette.secondary.main,0.25)}!important`} }} }}
                                    >
                                        {POST_TYPES.map(pt => { const Icon = pt.IconComponent; return ( <MenuItem key={pt.value} value={pt.value}> <Icon sx={{ mr: 1, fontSize: '1.1rem', verticalAlign: 'middle', color: alpha(theme.palette.primary.light, 0.7) }} /> {pt.label} </MenuItem> ); })}
                                    </Select>
                                </StyledFormControl>
                            </Box>
                            <Button
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={handleCreatePost}
                                disabled={(!newPostText.trim() && !selectedFile) || !currentUser?.id}
                                sx={{
                                    background: 'rgba(255,255,255,0.9) !important',
                                    fontWeight: 'bold', fontSize: '0.9rem', borderRadius: 'none !important',
                                    boxShadow: 'none !important',
                                    border: 'none !important',
                                    '&:hover': {  background: 'linear-gradient(45deg, #7A1FB8 0%, #3A00B0 100%) !important', boxShadow: '0 7px 18px rgba(142, 45, 226, 0.5)', color: 'white !important'},
                                    '&.Mui-disabled': { background: 'rgba(255,255,255,0.1) !important', color: 'rgba(255,255,255,0.5) !important', boxShadow: 'none !important' },
                                }}
                            >Опублікувати</Button>
                        </Box>
                        {previewMediaUrl && previewMediaType?.startsWith('image/') && <Box component="img" src={previewMediaUrl} alt="Preview" sx={{width: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: '8px', mt:1.5, border: '1px solid rgba(255,255,255,0.2)'}} />}
                        {previewMediaUrl && previewMediaType?.startsWith('video/') && <video src={previewMediaUrl} controls style={{width: '100%', maxHeight: 300, borderRadius: '8px', marginTop:'12px', border: '1px solid rgba(255,255,255,0.2)'}} />}
                    </Paper>

                    <StyledTextField
                        placeholder="Пошук постів за текстом, тегом або автором..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
                        InputProps={{ startAdornment: (<SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />) }}
                        sx={{ mb: {xs:2.5, md:3.5}, ...textFieldSx(false, false, searchTerm) }}
                        ownerState={{ textValue: searchTerm, multiline: false }}
                    />

                    {loading ? (
                        <Typography sx={{textAlign:'center', color:'rgba(255,255,255,0.6)', p:3}}>Завантаження...</Typography>
                    ) : paginatedPosts.length > 0 ? paginatedPosts.map(post => (
                        <PostCardStyled key={post.id} id={`post-${post.id}`} sx={{ mb: {xs: 2.5, sm: 3} }}>
                            <CardHeader
                                avatar={<Avatar src={post.isAnonymous ? "/static/images/avatar/anonymous.png" : post.author?.avatarUrl} sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.2), color: theme.palette.secondary.main, border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}` }}>{post.isAnonymous ? 'A' : post.author?.name?.charAt(0)}</Avatar>}
                                action={isAuthenticated && <IconButton aria-label="post-menu" onClick={(e) => handleOpenPostMenu(e, post)} sx={{color: 'rgba(255,255,255,0.6)', '&:hover': {backgroundColor: 'rgba(255,255,255,0.1)'}}}><MoreVertIcon /></IconButton>}
                                title={<Box sx={{display: 'flex', alignItems: 'center', marginLeft: -1}}>{getPostTypeIconElement(post.type)}<Typography variant="subtitle1" component="span" sx={{fontWeight: '600', color: 'white'}}>{post.author?.name || "Користувач"}</Typography></Box>}
                                subheader={<Typography variant="caption" sx={{color: 'rgba(255,255,255,0.5)', marginLeft: -0.7}}>{formatTimestamp(post.timestamp)}</Typography>}
                                sx={{
                                    pb: 1,
                                    pl: 0.5,
                                    alignItems: 'center',
                                }}/>
                            <CardContent sx={{ pt: 0, pb: 1, pl: 0.5 }}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'rgba(230, 220, 255, 0.9)', lineHeight: 1.65, mb: post.media || (post.tags && post.tags.length > 0) ? 1.5 : 0, wordBreak: 'break-word' }}>{post.text}</Typography>
                                {post.tags && post.tags.length > 0 && (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt:1 }}>
                                        {post.tags.map(tag => <Chip key={tag} label={`#${tag}`} size="small" onClick={() => {setSearchTerm(tag); setCurrentPage(1);}} sx={{backgroundColor: alpha(theme.palette.secondary.main,0.15), color: alpha(theme.palette.secondary.light,0.9), fontSize: '0.75rem', '&:hover':{backgroundColor: alpha(theme.palette.secondary.main,0.25), cursor:'pointer'}}} />)}
                                    </Box>
                                )}
                            </CardContent>
                            {post.media && (
                                <Box sx={{ mx: {xs: 2, sm: 2.5}, mb: 1.5, display: 'flex', justifyContent: 'center' }}>
                                    {post.media.type?.startsWith('image/') ? (
                                        <CardMedia component='img' sx={{ width: 'auto', maxWidth: '100%', maxHeight: {xs: 300, sm: 400, md: 500 }, objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}} image={post.media.url} alt="Post media" />
                                    ) : post.media.type?.startsWith('video/') ? (
                                        <video src={post.media.url} controls style={{width: '100%', maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}} />
                                    ) : null}
                                </Box>
                            )}
                            <CardActions disableSpacing sx={{ justifyContent: 'space-around', alignItems: 'center', px:1, py: 0.75, borderTop: `1px solid rgba(255,255,255,0.08)` }}>
                                <Button aria-label="like" onClick={() => isAuthenticated && handleLikePost(post.id)} disabled={!isAuthenticated} startIcon={post.likedByUser ? <FavoriteIcon sx={{color: theme.palette.error.light}}/> : <FavoriteBorderIcon />} sx={{color: post.likedByUser ? theme.palette.error.light : 'rgba(255,255,255,0.7)', textTransform:'none', '&:hover': {backgroundColor: alpha(post.likedByUser ? theme.palette.error.light : '#fff', 0.1)}, '&.Mui-disabled': {color: 'rgba(255,255,255,0.4)'}}}>{post.likes}</Button>
                                <Button aria-label="comment" onClick={() => handleOpenComments(post)} startIcon={<ChatBubbleOutlineIcon />} sx={{color: 'rgba(255,255,255,0.7)', textTransform:'none', '&:hover': {backgroundColor: alpha('#fff', 0.1)}}}>{post.commentsCount}</Button>
                                <Button aria-label="share" onClick={() => handleSharePost(post.id)} startIcon={<ShareIcon />} sx={{color: 'rgba(255,255,255,0.7)', textTransform:'none', '&:hover': {backgroundColor: alpha('#fff', 0.1)}}}>Поділитись</Button>
                            </CardActions>
                        </PostCardStyled>
                    )) : (<Typography sx={{textAlign:'center', color:'rgba(255,255,255,0.6)', p:3}}>За вашим запитом постів не знайдено. Спробуйте змінити пошук або створіть новий пост!</Typography>)}

                    {pageCount > 1 &&
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                            <Pagination count={pageCount} page={currentPage} onChange={(e, value) => setCurrentPage(value)}
                                        sx={{ '& .MuiPaginationItem-root': { color: 'rgba(255,255,255,0.7)', '&:hover': {backgroundColor: alpha(theme.palette.secondary.main,0.1)}, '&.Mui-selected': {backgroundColor: alpha(theme.palette.secondary.main,0.25), color: 'white', fontWeight:'bold'} }}}
                            />
                        </Box>
                    }
                </Container>

                <Menu
                    anchorEl={anchorElPostMenu}
                    open={Boolean(anchorElPostMenu) && Boolean(selectedPostForMenu)}
                    onClose={handleClosePostMenu}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'rgba(45,38,65,0.95)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            border: '1px solid rgba(138,43,226,0.3)',
                            borderRadius: '10px'
                        }
                    }}
                >
                    {selectedPostForMenu && currentUser && (
                        <Box>
                            {selectedPostForMenu.author?.id === currentUser.id || (selectedPostForMenu.isAnonymous && !isAuthenticated) ? (
                                <MenuItem
                                    onClick={() => handleDeletePost(selectedPostForMenu.id)}
                                    sx={{ '&:hover': { backgroundColor: alpha(theme.palette.error.dark, 0.25) } }}
                                >
                                    <DeleteIcon sx={{ mr: 1, color: alpha(theme.palette.error.light, 0.8) }} />
                                    Видалити пост
                                </MenuItem>
                            ) : (
                                <MenuItem
                                    onClick={() => handleReportPost(selectedPostForMenu?.id)}
                                    sx={{ '&:hover': { backgroundColor: alpha(theme.palette.warning.dark, 0.25) } }}
                                >
                                    <FlagIcon sx={{ mr: 1, color: alpha(theme.palette.warning.light, 0.8) }} />
                                    Поскаржитись
                                </MenuItem>
                            )}
                        </Box>
                    )}
                </Menu>

                <Modal open={openCommentsModal} onClose={handleCloseCommentsModal} aria-labelledby="comments-modal-title">
                    <ModalContentBox>
                        <Box sx={{ p: {xs:2, sm:2.5}, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
                            <Typography id="comments-modal-title" variant="h6" component="h2" sx={{fontWeight: 'bold'}}>Коментарі</Typography>
                            <IconButton onClick={handleCloseCommentsModal} sx={{color: 'white', '&:hover':{backgroundColor:'rgba(255,255,255,0.1)'}}}><CloseIcon /></IconButton>
                        </Box>
                        <Box sx={{ overflowY: 'auto', p: {xs:1.5, sm:2.5}, flexGrow: 1 }}>
                            {selectedPostForComment && (comments[selectedPostForComment.id] || []).length > 0 ? (comments[selectedPostForComment.id] || []).map(comment => (
                                <Paper key={comment.id} sx={{ p: {xs:1.5, sm:2}, mb: 1.5, background: 'hsl(220, 30%, 6%)', borderRadius: '10px', border: '1px solid rgba(138, 43, 226, 0.15)' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent:'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                            <Avatar src={comment.isAnonymous ? "/static/images/avatar/anonymous.png" : comment.author?.avatarUrl} sx={{ width: 32, height: 32, mr: 1.5, fontSize: '0.9rem' }}>{comment.isAnonymous ? 'A' : comment.author?.name?.charAt(0)}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: '600', color: alpha(theme.palette.secondary.light,0.9) }}>{comment.isAnonymous ? 'Анонім' : comment.author?.name}</Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{formatTimestamp(comment.timestamp)}</Typography>
                                            </Box>
                                        </Box>
                                        {isAuthenticated && currentUser && comment.author?.id === currentUser.id &&
                                            <IconButton size="small" onClick={() => handleDeleteComment(selectedPostForComment.id, comment.id)} sx={{color:alpha(theme.palette.error.light,0.7), '&:hover':{backgroundColor:alpha(theme.palette.error.dark,0.15)}}}> <DeleteIcon fontSize="small"/> </IconButton>
                                        }
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(230, 220, 255, 0.85)', whiteSpace: 'pre-wrap', wordBreak:'break-word' }}>{comment.text}</Typography>
                                </Paper>
                            )) : <Typography sx={{textAlign: 'center', color: 'rgba(255,255,255,0.6)', p:3}}>Коментарів ще немає. Будьте першим!</Typography>}
                        </Box>
                        <Box sx={{ p: {xs:1.5, sm:2}, borderTop: `1px solid rgba(255,255,255,0.1)`}}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar src={currentUser?.avatarUrl || "/static/images/avatar/default.jpg"} sx={{ width: 40, height: 40 }} />
                                <StyledTextField
                                    multiline
                                    rows={1}
                                    maxRows={4}
                                    placeholder="Напишіть коментар..."
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    ownerState={{ isCommentField: true, textValue: newCommentText, multiline: true }}
                                    sx={textFieldSx(true, true, newCommentText)}
                                />
                                <IconButton
                                    onClick={handlePostComment}
                                    disabled={!newCommentText.trim()}
                                    sx={{
                                        color: theme.palette.secondary.main,
                                        height: '40px',
                                        width: '40px',
                                        p:0,
                                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                        '&:hover': {backgroundColor: alpha(theme.palette.secondary.main, 0.2)},
                                        '&.Mui-disabled': {color: 'rgba(255,255,255,0.3)', backgroundColor: 'transparent'}
                                    }}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </ModalContentBox>
                </Modal>
                <Footer />
            </Box>
        </AppTheme>
    );
}

export default CommunityPage;