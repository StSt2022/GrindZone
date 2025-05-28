import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
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
import VideocamIcon from '@mui/icons-material/Videocam';
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

const pagesNav = [ { title: 'Профіль', path: '/profile' }, { title: 'Активності', path: '/activities' }, { title: 'Харчування', path: '/food' }, { title: 'Спільнота', path: '/community' }];
const settingsMenu = ['Профіль', 'Налаштування', 'Вихід'];

const navButtonBaseStyles = { my: 2, color: 'rgba(255, 255, 255, 0.9)', display: 'block', px: 2.2, py: 0.8, borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.03)', boxShadow: 'none', transition: 'all 0.25s ease-out', textTransform: 'none', fontWeight: 500, fontSize: '0.9rem', '&:hover': { background: 'rgba(255, 255, 255, 0.12)', transform: 'translateY(-1px)', boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)', color: 'white'}};

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
            overflowY: 'auto !important',
            resize: 'none',
            // maxHeight буде задаватися через maxRows на компоненті TextField
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

const StyledFormControl = styled(FormControl)({
    minWidth: 120,
    '& .MuiOutlinedInput-root': {
        color: 'rgba(255, 255, 255, 0.9)',
        backgroundColor: 'rgba(40, 32, 60, 0.7)',
        borderRadius: '10px',
        '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.4)' },
        '&:hover fieldset': { borderColor: 'rgba(198, 126, 255, 0.8)' },
        '&.Mui-focused fieldset': { borderColor: '#c67eff' },
        '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.6)'},
    '& .MuiInputLabel-root.Mui-focused': { color: '#c67eff'},
});

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

const extractHashtags = (text) => {
    const regex = /#([a-zA-Z0-9_а-яА-ЯіІїЇєЄ]+)/g;
    let matches;
    const hashtags = [];
    while ((matches = regex.exec(text)) !== null) {
        hashtags.push(matches[1]);
    }
    return hashtags;
};

const initialPostsData = [
    { id: '1', author: { id: 'user1', name: 'Олена Коваленко', avatarUrl: '/static/images/avatar/2.jpg' }, isAnonymous: false, type: 'question', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), text: "Привіт усім! 👋 Які ваші улюблені вправи для тренування пресу вдома? Діліться досвідом! #фітнес #домашнітренування", media: null, likes: 25, likedByUser: false, commentsCount: 2, tags: ['фітнес', 'домашнітренування'] },
    { id: '2', author: null, isAnonymous: true, type: 'question', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), text: "Підкажіть, будь ласка, хороші ресурси (статті, відео) для початківців у йозі. Хочу спробувати, але не знаю, з чого почати. Дякую! #йога", media: null, likes: 15, likedByUser: true, commentsCount: 0, tags: ['йога', 'поради'] },
    { id: '3', author: { id: 'user2', name: 'Максим Грищенко', avatarUrl: '/static/images/avatar/3.jpg' }, isAnonymous: false, type: 'achievement', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), text: "Щойно завершив неймовірний 10-кілометровий забіг! 🏃‍♂️ Погода була чудова, а відчуття після - просто космос! Хто сьогодні теж бігав? #біг #мотивація", media: { type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop' }, likes: 42, likedByUser: false, commentsCount: 1, tags: ['біг', 'мотивація'] },
    { id: '4', author: { id: 'user3', name: 'Адміністрація Grindzone', avatarUrl: '/static/images/avatar/grindzone-logo.png' }, isAnonymous: false, type: 'article', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), text: "🎬 Наш новий туторіал про техніку присідань вже на сайті! #присідання #техніка", media: { type: 'video/mp4', url: '/static/videos/sample-video.mp4' }, likes: 68, likedByUser: true, commentsCount: 0, tags: ['присідання', 'техніка'] },
    ...Array.from({ length: 15 }, (_, i) => ({ id: `mock${i + 5}`, author: { id: `user${i + 4}`, name: `User ${i + 4}`, avatarUrl: `/static/images/avatar/${(i % 5) + 1}.jpg` }, isAnonymous: false, type: 'text', timestamp: new Date(Date.now() - (i + 3) * 24 * 60 * 60 * 1000).toISOString(), text: `Це тестовий пост номер ${i + 5}. Обговорюємо #тест${i} та #розробка.`, media: null, likes: Math.floor(Math.random() * 50), likedByUser: Math.random() > 0.5, commentsCount: Math.floor(Math.random() * 5), tags: [`тест${i}`, 'розробка'] }))
];

const initialCommentsData = {
    '1': [ { id: 'c1-1', postId: '1', author: { id: 'user4', name: 'Ігор Петренко', avatarUrl: '/static/images/avatar/4.jpg' }, text: "Я обожнюю планку у всіх її варіаціях!", timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() }, { id: 'c1-2', postId: '1', author: { id: 'user5', name: 'Софія Мельник', avatarUrl: '/static/images/avatar/5.jpg' }, text: "Скручування та підйоми ніг – класика!", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() } ],
    '3': [ { id: 'c3-1', postId: '3', author: { id: 'user1', name: 'Олена Коваленко', avatarUrl: '/static/images/avatar/2.jpg' }, text: "Круто, Максиме!", timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() } ]
};


function CommunityPage(props) {
    const theme = useTheme();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = React.useState(true);
    const [currentUser, setCurrentUser] = React.useState({ id: 'currentUser', name: 'Василь Пупкін', avatarUrl: '/static/images/avatar/1.jpg' });
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElPostMenu, setAnchorElPostMenu] = React.useState(null);
    const [selectedPostForMenu, setSelectedPostForMenu] = React.useState(null);
    const navigate = useNavigate();

    const [posts, setPosts] = React.useState(initialPostsData);
    const [comments, setComments] = React.useState(initialCommentsData);
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

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleOpenPostMenu = (event, post) => { setAnchorElPostMenu(event.currentTarget); setSelectedPostForMenu(post); };
    const handleClosePostMenu = () => { setAnchorElPostMenu(null); setSelectedPostForMenu(null); };

    const handleSettingClick = (setting) => {
        if (setting === 'Вихід') { setIsAuthenticated(false); setCurrentUser(null); navigate('/'); }
        else if (setting === 'Профіль') navigate('/profile');
        else console.log("Перехід до налаштувань");
        handleCloseUserMenu();
    };

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
            setSelectedFile(null);
            setPreviewMediaUrl(null);
            setPreviewMediaType(null);
        }
    };

    const handleCreatePost = () => {
        if (!newPostText.trim() && !selectedFile) return;

        const rawText = newPostText;
        const hashtags = extractHashtags(rawText);
        let textForPost = rawText;

        if (hashtags.length > 0) {
            const hashtagRegex = /#([a-zA-Z0-9_а-яА-ЯіІїЇєЄ]+)/g;
            textForPost = rawText.replace(hashtagRegex, "").replace(/\s\s+/g, ' ').trim();
        }

        let mediaData = null;
        if (selectedFile && previewMediaUrl && previewMediaType) {
            mediaData = {
                type: previewMediaType,
                url: previewMediaUrl
            };
        }

        const newPost = {
            id: String(Date.now()),
            author: isAuthenticated ? currentUser : null,
            isAnonymous: !isAuthenticated,
            type: newPostType,
            timestamp: new Date().toISOString(),
            text: textForPost,
            media: mediaData,
            likes: 0,
            likedByUser: false,
            commentsCount: 0,
            tags: hashtags
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);

        setNewPostText("");
        setNewPostType('text');
        setSelectedFile(null);
        // НЕ очищуємо previewMediaUrl тут, щоб він залишився в newPost.media.url
        // Він буде очищений при видаленні поста або при виборі нового файлу в handleFileChange
        // setPreviewMediaUrl(null);
        // setPreviewMediaType(null);
        const fileInput = document.getElementById('file-input-for-post');
        if (fileInput) {
            fileInput.value = "";
        }

        if (currentPage !== 1) setCurrentPage(1);
    };

    const handleDeletePost = (postId) => {
        const postToDelete = posts.find(p => p.id === postId);
        if (postToDelete && postToDelete.media && postToDelete.media.url.startsWith('blob:')) {
            URL.revokeObjectURL(postToDelete.media.url);
        }
        setPosts(posts.filter(post => post.id !== postId));
        const newComments = { ...comments };
        delete newComments[postId];
        setComments(newComments);
        handleClosePostMenu();
    };

    const handleReportPost = (postId) => {
        console.log(`User ${currentUser?.id || 'anonymous'} reported post ${postId}`);
        alert(`Пост ${postId} було відправлено на розгляд.`);
        handleClosePostMenu();
    };

    const handleLikePost = (postId) => {
        setPosts(posts.map(post => post.id === postId ? { ...post, likedByUser: !post.likedByUser, likes: post.likedByUser ? post.likes - 1 : post.likes + 1 } : post));
    };

    const handleOpenComments = (post) => { setSelectedPostForComment(post); setOpenCommentsModal(true); };
    const handleCloseCommentsModal = () => { setOpenCommentsModal(false); setSelectedPostForComment(null); setNewCommentText(""); };

    const handlePostComment = () => {
        if (!newCommentText.trim() || !selectedPostForComment) return;
        const newComment = {
            id: String(Date.now()),
            postId: selectedPostForComment.id,
            author: isAuthenticated ? currentUser : {id:null, name: 'Анонім', avatarUrl: '/static/images/avatar/anonymous.png'},
            text: newCommentText,
            timestamp: new Date().toISOString(),
        };
        setComments(prev => ({ ...prev, [selectedPostForComment.id]: [...(prev[selectedPostForComment.id] || []), newComment] }));
        setPosts(posts.map(p => p.id === selectedPostForComment.id ? {...p, commentsCount: (comments[selectedPostForComment.id]?.length || 0) + 1} : p));
        setNewCommentText("");
    };

    const handleDeleteComment = (postId, commentId) => {
        setComments(prev => ({ ...prev, [postId]: prev[postId].filter(c => c.id !== commentId) }));
        setPosts(posts.map(p => p.id === postId ? {...p, commentsCount: (comments[postId]?.length || 1) - 1} : p));
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
    const pageCount = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

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
    }, [location.hash, paginatedPosts, navigate, location.pathname]);


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
                minHeight: isComment ? '20px' : '40px', // min-height для textarea
            })
        }
    });


    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
                <Box sx={gridBackgroundStyles} />
                <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, rgba(30, 35, 50, 0.8) 0%, rgba(50, 55, 75, 0.9) 100%)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottomLeftRadius: {sm: '20px'}, borderBottomRightRadius: {sm: '20px'}, boxShadow: '0 5px 25px rgba(0, 0, 0, 0.25)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', zIndex: 1200 }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Typography variant="h6" noWrap component={Link} to="/" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontWeight: 700, letterSpacing: '.2rem', color: 'white', textDecoration: 'none', textShadow: '0 0 8px rgba(255, 255, 255, 0.4)'}}>GRINDZONE</Typography>
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton size="large" onClick={handleOpenNavMenu} sx={{ color: 'white', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(5px)', borderRadius: '50%', p: 1, boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', '&:hover': { background: 'rgba(255, 255, 255, 0.15)' } }}><MenuIcon /></IconButton>
                                <Menu id="menu-appbar-mobile" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left' }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiPaper-root': { background: 'rgba(35, 40, 55, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '15px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)', minWidth: '200px', }, '& .MuiList-root': { padding: '8px' }, '& .MuiMenuItem-root': { borderRadius: '10px', margin: '4px 0', color: 'rgba(255, 255, 255, 0.9)', transition: 'all 0.2s ease', justifyContent: 'center', '&:hover': { background: 'rgba(255, 255, 255, 0.1)', color: 'white',}}}}>
                                    {isAuthenticated ? (pagesNav.map((page) => (<MenuItem key={page.title} onClick={() => { handleCloseNavMenu(); navigate(page.path); }}><Typography textAlign="center">{page.title}</Typography></MenuItem>))) : ([<MenuItem key="signin" onClick={() => { handleCloseNavMenu(); navigate('/signin'); }}><Typography textAlign="center">Увійти</Typography></MenuItem>, <MenuItem key="signup" onClick={() => { handleCloseNavMenu(); navigate('/signup'); }}><Typography textAlign="center">Зареєструватися</Typography></MenuItem>])}
                                </Menu>
                            </Box>
                            <Typography variant="h5" noWrap component={Link} to="/" sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'center', fontWeight: 700, letterSpacing: '.2rem', color: 'white', textDecoration: 'none', textShadow: '0 0 8px rgba(255, 255, 255, 0.4)', ...(isAuthenticated && { pr: '56px' })}}>GRINDZONE</Typography>
                            <Box sx={{ flexGrow: { xs: 0, md: 1 }, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
                                    {isAuthenticated && pagesNav.map((page) => (<Button key={page.title} component={Link} to={page.path} sx={{...navButtonBaseStyles, ...(location.pathname === page.path && {background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(198, 126, 255, 0.5)'}) }}>{page.title}</Button>))}
                                </Box>
                                {isAuthenticated ? (<Box sx={{ ml: {md: 1 } }}><Tooltip title="Відкрити налаштування"><IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(5px)', boxShadow: '0 0 12px rgba(60, 120, 220, 0.3)', transition: 'all 0.3s ease', borderRadius: '50%', '&:hover': { background: 'rgba(255, 255, 255, 0.18)', transform: 'scale(1.05)' } }}><Avatar alt={currentUser?.name} src={currentUser?.avatarUrl} sx={{ border: '2px solid rgba(60, 120, 220, 0.5)', width: 40, height: 40 }} /></IconButton></Tooltip><Menu id="menu-appbar-user" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} sx={{ mt: '45px', '& .MuiPaper-root': { background: 'rgba(35, 40, 55, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '15px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)', minWidth: '180px',}, '& .MuiList-root': { padding: '8px' }, '& .MuiMenuItem-root': { borderRadius: '10px', margin: '4px 0', color: 'rgba(255, 255, 255, 0.9)', transition: 'all 0.2s ease', '&:hover': { background: 'rgba(255, 255, 255, 0.1)', color: 'white',}} }}>{settingsMenu.map((setting) => (<MenuItem key={setting} onClick={() => handleSettingClick(setting)}><Typography textAlign="center" sx={{flexGrow: 1}}>{setting}</Typography></MenuItem>))}</Menu></Box>) : (<Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, ml: {md:1} }}><Button component={Link} to="/signin" sx={{...navButtonBaseStyles}}>Увійти</Button><Button component={Link} to="/signup" sx={{...navButtonBaseStyles, background: 'linear-gradient(45deg, #0072ff 0%, #00c6ff 100%)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(0, 114, 255, 0.25)', '&:hover': { ...navButtonBaseStyles['&:hover'], background: 'linear-gradient(45deg, #005fcc 0%, #00a0cc 100%)', boxShadow: '0 6px 15px rgba(0, 114, 255, 0.35)'}}}>Зареєструватися</Button></Box>)}
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 }, position: 'relative', zIndex: 5, flexGrow: 1 }}>
                    <Typography variant="h3" component="h1" sx={{ textAlign: 'center', mb: 1, fontWeight: 'bold', color: 'white', textShadow: '0 0 15px rgba(198, 126, 255, 0.4)' }}>Стрічка Спільноти</Typography>
                    <Typography variant="h6" component="p" sx={{ textAlign: 'center', mb: {xs:3, md:4}, color: 'rgba(230, 220, 255, 0.85)', fontSize: { xs: '1rem', sm: '1.1rem' } }}>Діліться думками, знаннями та досягненнями!</Typography>

                    <Paper sx={{ p: {xs: 2, sm: 2.5}, mb: {xs:3, md:4}, backgroundColor: 'hsl(220, 30%, 6%)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(138, 43, 226, 0.25)', boxShadow: '0 10px 35px rgba(0, 0, 0, 0.25)', }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
                            <Avatar
                                src={isAuthenticated ? currentUser?.avatarUrl : "/static/images/avatar/anonymous.png"}
                                sx={{ width: 48, height: 48, mt: theme.spacing(1), border: '2px solid rgba(198, 126, 255, 0.5)' }}
                            />
                            <StyledTextField
                                multiline
                                rows={3}
                                maxRows={6}
                                placeholder={isAuthenticated ? `Що у вас на думці, ${currentUser?.name.split(' ')[0]}?` : "Напишіть анонімне повідомлення..."}
                                value={newPostText}
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
                                disabled={(!newPostText.trim() && !selectedFile) || (isAuthenticated && !currentUser)}
                                sx={{
                                    background: 'linear-gradient(45deg, #8E2DE2 0%, #4A00E0 100%)', // Більш насичений фіолетовий
                                    color: 'white', fontWeight: 'bold', fontSize: '0.9rem', borderRadius: '10px',
                                    boxShadow: '0 5px 12px rgba(142, 45, 226, 0.4)',
                                    '&:hover': {  background: 'linear-gradient(45deg, #7A1FB8 0%, #3A00B0 100%)', boxShadow: '0 7px 18px rgba(142, 45, 226, 0.5)' },
                                    '&.Mui-disabled': { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', boxShadow: 'none'}
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

                    {paginatedPosts.length > 0 ? paginatedPosts.map(post => (
                        <PostCardStyled key={post.id} id={`post-${post.id}`} sx={{ mb: {xs: 2.5, sm: 3} }}>
                            <CardHeader
                                avatar={<Avatar src={post.isAnonymous ? "/static/images/avatar/anonymous.png" : post.author?.avatarUrl} sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.2), color: theme.palette.secondary.main, border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}` }}>{post.isAnonymous ? 'A' : post.author?.name?.charAt(0)}</Avatar>}
                                action={isAuthenticated && <IconButton aria-label="post-menu" onClick={(e) => handleOpenPostMenu(e, post)} sx={{color: 'rgba(255,255,255,0.6)', '&:hover': {backgroundColor: 'rgba(255,255,255,0.1)'}}}><MoreVertIcon /></IconButton>}
                                title={<Box sx={{display: 'flex', alignItems: 'center'}}>{getPostTypeIconElement(post.type)}<Typography variant="subtitle1" component="span" sx={{fontWeight: '600', color: 'white'}}>{post.isAnonymous ? "Анонімний Користувач" : post.author?.name}</Typography></Box>}
                                subheader={<Typography variant="caption" sx={{color: 'rgba(255,255,255,0.5)'}}>{formatTimestamp(post.timestamp)}</Typography>}
                                sx={{pb: 1, alignItems: 'flex-start'}}
                            />
                            <CardContent sx={{pt: 0, pb: 1}}>
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

                <Menu anchorEl={anchorElPostMenu} open={Boolean(anchorElPostMenu)} onClose={handleClosePostMenu} PaperProps={{sx: {backgroundColor: 'rgba(45,38,65,0.95)', backdropFilter: 'blur(10px)', color:'white', border:'1px solid rgba(138,43,226,0.3)', borderRadius:'10px'}}}>
                    {selectedPostForMenu && currentUser && (selectedPostForMenu.author?.id === currentUser.id || (selectedPostForMenu.isAnonymous && !isAuthenticated)) ? (
                        <MenuItem onClick={() => handleDeletePost(selectedPostForMenu.id)} sx={{'&:hover':{backgroundColor:alpha(theme.palette.error.dark,0.25)}}}> <DeleteIcon sx={{mr:1, color: alpha(theme.palette.error.light,0.8)}}/> Видалити пост</MenuItem>
                    ) : (
                        <MenuItem onClick={() => handleReportPost(selectedPostForMenu?.id)} sx={{'&:hover':{backgroundColor:alpha(theme.palette.warning.dark,0.25)}}}> <FlagIcon sx={{mr:1, color: alpha(theme.palette.warning.light,0.8)}}/> Поскаржитись</MenuItem>
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
                                            <Avatar src={comment.author?.avatarUrl || "/static/images/avatar/anonymous.png"} sx={{ width: 32, height: 32, mr: 1.5, fontSize: '0.9rem' }}>{comment.author?.name?.charAt(0) || 'A'}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: '600', color: alpha(theme.palette.secondary.light,0.9) }}>{comment.author?.name || 'Анонім'}</Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{formatTimestamp(comment.timestamp)}</Typography>
                                            </Box>
                                        </Box>
                                        {isAuthenticated && comment.author?.id === currentUser.id &&
                                            <IconButton size="small" onClick={() => handleDeleteComment(selectedPostForComment.id, comment.id)} sx={{color:alpha(theme.palette.error.light,0.7), '&:hover':{backgroundColor:alpha(theme.palette.error.dark,0.15)}}}> <DeleteIcon fontSize="small"/> </IconButton>
                                        }
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(230, 220, 255, 0.85)', whiteSpace: 'pre-wrap', wordBreak:'break-word' }}>{comment.text}</Typography>
                                </Paper>
                            )) : <Typography sx={{textAlign: 'center', color: 'rgba(255,255,255,0.6)', p:3}}>Коментарів ще немає. Будьте першим!</Typography>}
                        </Box>
                        <Box sx={{ p: {xs:1.5, sm:2}, borderTop: `1px solid rgba(255,255,255,0.1)`}}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar src={isAuthenticated ? currentUser?.avatarUrl : "/static/images/avatar/anonymous.png"} sx={{ width: 40, height: 40 }} />
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
                                    disabled={!newCommentText.trim() || (isAuthenticated && !currentUser)}
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