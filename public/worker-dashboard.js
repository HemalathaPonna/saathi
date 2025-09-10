document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const workerNameDisplay = document.querySelector('.worker-name');
    const profilePic = document.querySelector('.profile-pic');
    const languageDropdown = document.getElementById('language-dropdown');
    const notificationBell = document.getElementById('notification-bell');
    const logoutButtons = document.querySelectorAll('.logout-btn');
    const backToHomeBtn = document.getElementById('back-to-home-btn'); // NEW ELEMENT

    // Availability Toggles
    const availabilityToggleOverview = document.getElementById('availability-toggle');
    const availabilityStatusTextOverview = document.getElementById('availability-status-text');
    const availabilityToggleLarge = document.getElementById('availability-toggle-large');
    const availabilityStatusTextLarge = document.getElementById('availability-status-text-large');

    // Stats
    const totalBookings = document.getElementById('total-bookings');
    const totalEarnings = document.getElementById('total-earnings');
    const workerRatings = document.getElementById('worker-ratings');
    const viewReportsBtn = document.querySelector('.view-reports-btn');
    const viewAllBookingsBtn = document.querySelector('.view-all-bookings-btn');

    // Bookings
    const upcomingBookingsListOverview = document.getElementById('quick-bookings-list'); // For overview section
    const upcomingBookingsListFull = document.getElementById('upcoming-bookings-list'); // For dedicated bookings section
    const bookingHistoryList = document.getElementById('booking-history-list');

    // Profile Form
    const profileForm = document.getElementById('profile-form');
    const profileWorkerName = document.getElementById('worker-name');
    const profileServiceCategory = document.getElementById('service-category');
    const profilePhoneNumber = document.getElementById('phone-number');
    const profileLanguagesSupported = document.getElementById('languages-supported');
    const currentPassword = document.getElementById('current-password');
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');
    const historyFilterForm = document.querySelector('.filters');

    // Chat Modal Elements
    const chatModal = document.getElementById('chat-modal');
    const closeModalBtn = chatModal ? chatModal.querySelector('.close-btn') : null;
    const chatCustomerName = document.getElementById('chat-customer-name');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatTextInput = document.getElementById('chat-input-text');
    const chatQuickOptions = document.getElementById('chat-quick-options');
    const microphoneBtn = document.getElementById('microphone-btn');

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    // --- Mock Data ---
    const registeredWorkerData = {
        name: localStorage.getItem('workerName') || 'John Smith',
        profilePicUrl: 'https://img.freepik.com/premium-vector/cartoon-character-vector-illustration_1128655-324.jpg?w=2000',
        isAvailable: JSON.parse(localStorage.getItem('workerAvailability')) || false,
        serviceCategory: 'Plumber',
        phoneNumber: '+1 234 567 8900',
        languages: 'English, Hindi'
    };

    let mockBookings = [
        { id: 'b001', customerName: 'Jane Doe', service: 'Faucet Repair', dateTime: 'Dec 15, 2025, 10:00 AM', status: 'upcoming' },
        { id: 'b002', customerName: 'Robert Johnson', service: 'Pipe Installation', dateTime: 'Dec 16, 2025, 02:30 PM', status: 'upcoming' },
        { id: 'b003', customerName: 'Alice Smith', service: 'Drain Cleaning', dateTime: 'Nov 20, 2025, 09:00 AM', status: 'completed' },
        { id: 'b004', customerName: 'Bob Williams', service: 'Water Heater Fix', dateTime: 'Nov 22, 2025, 01:00 PM', status: 'completed' },
        { id: 'b005', customerName: 'Charlie Brown', service: 'Leak Detection', dateTime: 'Oct 05, 2025, 04:00 PM', status: 'cancelled' }
    ];

    const mockStats = {
        totalBookings: mockBookings.filter(b => b.status === 'completed').length,
        earningsToDate: '$' + (mockBookings.filter(b => b.status === 'completed').length * 150).toLocaleString(),
        ratings: '4.8/5'
    };

    const mockChatHistory = {
        'b001': [
            { sender: 'customer', message: 'Hi, is this John? My faucet is leaking badly!' },
            { sender: 'worker', message: 'Yes, this is John. On my way!' }
        ],
        'b002': [
            { sender: 'customer', message: 'Hello, I need a new pipe installed for my kitchen sink.' }
        ]
    };

    let bookingsPieChartInstance;

    // --- Language Translation Data ---
    const TRANSLATIONS = {
        en: {
            nav_overview: 'Dashboard Overview',
            nav_availability: 'Availability',
            nav_bookings: 'Bookings',
            nav_history: 'Booking History',
            nav_reports: 'Reports & Analytics',
            nav_profile: 'Update Profile',
            header_logout: 'Logout',
            header_back_to_home: 'Back to Home', // NEW TRANSLATION
            overview_heading: 'Dashboard Overview',
            stats_heading: 'Earnings & Stats',
            stats_totalBookings: 'Total Bookings',
            stats_earnings: 'Earnings to Date',
            stats_ratings: 'Ratings',
            stats_reportsBtn: 'View Detailed Reports',
            availability_heading_short: 'Current Availability',
            availability_heading_long: 'Manage Availability',
            availability_status_on: 'Available',
            availability_status_off: 'Not Available',
            availability_info_short: 'Update your availability for new service requests.',
            availability_info_long: "Toggle this switch to let customers know if you're available for new service requests. Your status will update immediately.",
            bookings_heading_short: 'Quick Look: Upcoming Bookings',
            bookings_heading_long: 'Upcoming & Active Bookings',
            bookings_customer: 'Customer:',
            bookings_service: 'Service:',
            bookings_dateTime: 'Date & Time:',
            bookings_contactBtn: 'Contact',
            bookings_completeBtn: 'Mark as Completed',
            bookings_viewAllBtn: 'View All Bookings',
            bookings_noUpcoming: 'No upcoming bookings.',
            history_heading: 'Booking History',
            history_filterDate: 'Filter by Date:',
            history_filterService: 'Service Type:',
            history_filterStatus: 'Status:',
            history_applyBtn: 'Apply Filters',
            history_downloadBtn: 'Download Reports',
            history_noHistory: 'No past bookings found with current filters.',
            history_status_completed: 'Completed',
            history_status_cancelled: 'Cancelled',
            history_status_all: 'All',
            reports_heading: 'Reports & Analytics',
            reports_snapshot: 'Your Performance Snapshot',
            reports_chartTitle: 'Completed Bookings by Service Category',
            reports_chartDesc: 'This chart shows the percentage of your completed bookings by service category over the last 30 days.',
            reports_growthHeading: 'Growth Plan & Insights',
            reports_insights: 'Based on your recent performance, here are some insights and recommendations to boost your earnings and ratings:',
            reports_exploreBtn: 'Explore Marketing Tools',
            profile_heading: 'Update Profile',
            profile_details: 'Personal & Service Details',
            profile_name: 'Name',
            profile_serviceCategory: 'Service Category',
            profile_phone: 'Phone Number',
            profile_languages: 'Languages Supported',
            profile_currentPass: 'Current Password',
            profile_newPass: 'New Password',
            profile_confirmPass: 'Confirm New Password',
            profile_saveBtn: 'Save Changes',
            profile_passMismatch: 'New password and confirm password do not match!',
            profile_success: 'Profile details updated successfully!',
            chat_heading: 'Chat with ',
            chat_inputPlaceholder: 'Type your message or select an option...',
            chat_sendBtn: 'Send',
            chat_quickOnMyWay: 'On my way!',
            chat_quick15min: '15 mins ETA',
            chat_quickJobDone: 'Job done',
            chat_quickMoreDetails: 'More details',
            chat_info: "You're chatting with ",
            alert_availabilityOn: 'Your availability is now ON.',
            alert_availabilityOff: 'Your availability is now OFF.',
            alert_logout: 'Logged out! (Simulated)',
            alert_completeSuccess: 'Booking marked as completed!',
            alert_completeFail: 'Failed to mark booking as completed. Please try again.',
            alert_mic: 'Microphone activated! (Simulated)'
        },
        hi: {
            nav_overview: 'डैशबोर्ड अवलोकन',
            nav_availability: 'उपलब्धता',
            nav_bookings: 'बुकिंग',
            nav_history: 'बुकिंग इतिहास',
            nav_reports: 'रिपोर्ट और विश्लेषण',
            nav_profile: 'प्रोफ़ाइल अपडेट करें',
            header_logout: 'लॉग आउट',
            header_back_to_home: 'होम पर वापस जाएं', // NEW TRANSLATION
            overview_heading: 'डैशबोर्ड अवलोकन',
            stats_heading: 'कमाई और आँकड़े',
            stats_totalBookings: 'कुल बुकिंग',
            stats_earnings: 'आज तक की कमाई',
            stats_ratings: 'रेटिंग',
            stats_reportsBtn: 'विस्तृत रिपोर्ट देखें',
            availability_heading_short: 'वर्तमान उपलब्धता',
            availability_heading_long: 'उपलब्धता प्रबंधित करें',
            availability_status_on: 'उपलब्ध',
            availability_status_off: 'उपलब्ध नहीं है',
            availability_info_short: 'नई सेवा अनुरोधों के लिए अपनी उपलब्धता अपडेट करें।',
            availability_info_long: 'ग्राहकों को यह बताने के लिए इस स्विच को टॉगल करें कि क्या आप नई सेवा अनुरोधों के लिए उपलब्ध हैं। आपकी स्थिति तुरंत अपडेट हो जाएगी।',
            bookings_heading_short: 'आगामी बुकिंग: एक त्वरित नज़र',
            bookings_heading_long: 'आगामी और सक्रिय बुकिंग',
            bookings_customer: 'ग्राहक:',
            bookings_service: 'सेवा:',
            bookings_dateTime: 'दिनांक और समय:',
            bookings_contactBtn: 'संपर्क करें',
            bookings_completeBtn: 'पूरा हुआ चिह्नित करें',
            bookings_viewAllBtn: 'सभी बुकिंग देखें',
            bookings_noUpcoming: 'कोई आगामी बुकिंग नहीं।',
            history_heading: 'बुकिंग इतिहास',
            history_filterDate: 'दिनांक से फ़िल्टर करें:',
            history_filterService: 'सेवा प्रकार:',
            history_filterStatus: 'स्थिति:',
            history_applyBtn: 'फ़िल्टर लागू करें',
            history_downloadBtn: 'रिपोर्ट डाउनलोड करें',
            history_noHistory: 'वर्तमान फ़िल्टर के साथ कोई पिछला बुकिंग नहीं मिला।',
            history_status_completed: 'पूरा हुआ',
            history_status_cancelled: 'रद्द कर दिया गया',
            history_status_all: 'सभी',
            reports_heading: 'रिपोर्ट और विश्लेषण',
            reports_snapshot: 'आपके प्रदर्शन का स्नैपशॉट',
            reports_chartTitle: 'सेवा श्रेणी द्वारा पूरी की गई बुकिंग',
            reports_chartDesc: 'यह चार्ट पिछले 30 दिनों में सेवा श्रेणी द्वारा आपकी पूरी की गई बुकिंग का प्रतिशत दिखाता है।',
            reports_growthHeading: 'विकास योजना और अंतर्दृष्टि',
            reports_insights: 'आपके हाल के प्रदर्शन के आधार पर, यहाँ आपकी कमाई और रेटिंग को बढ़ाने के लिए कुछ अंतर्दृष्टि और सिफारिशें दी गई हैं:',
            reports_exploreBtn: 'विपणन उपकरण खोजें',
            profile_heading: 'प्रोफ़ाइल अपडेट करें',
            profile_details: 'व्यक्तिगत और सेवा विवरण',
            profile_name: 'नाम',
            profile_serviceCategory: 'सेवा श्रेणी',
            profile_phone: 'फ़ोन नंबर',
            profile_languages: 'समर्थित भाषाएँ',
            profile_currentPass: 'वर्तमान पासवर्ड',
            profile_newPass: 'नया पासवर्ड',
            profile_confirmPass: 'नया पासवर्ड की पुष्टि करें',
            profile_saveBtn: 'परिवर्तन सहेजें',
            profile_passMismatch: 'नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते हैं!',
            profile_success: 'प्रोफ़ाइल विवरण सफलतापूर्वक अपडेट किए गए!',
            chat_heading: 'के साथ चैट करें ',
            chat_inputPlaceholder: 'अपना संदेश टाइप करें या एक विकल्प चुनें...',
            chat_sendBtn: 'भेजें',
            chat_quickOnMyWay: 'मैं रास्ते में हूँ!',
            chat_quick15min: '15 मिनट में पहुँचूँगा',
            chat_quickJobDone: 'काम पूरा हो गया',
            chat_quickMoreDetails: 'और विवरण चाहिए',
            chat_info: "आप इसके साथ चैट कर रहे हैं",
            alert_availabilityOn: 'आपकी उपलब्धता अब चालू है।',
            alert_availabilityOff: 'आपकी उपलब्धता अब बंद है।',
            alert_logout: 'लॉग आउट किया गया! (सिमुलेटेड)',
            alert_completeSuccess: 'बुकिंग को पूरा हुआ चिह्नित किया गया!',
            alert_completeFail: 'बुकिंग को पूरा हुआ चिह्नित करने में विफल। कृपया पुन: प्रयास करें।',
            alert_mic: 'माइक्रोफ़ोन सक्रिय! (सिमुलेटेड)'
        },
        te: {
            nav_overview: 'డాష్‌బోర్డ్ అవలోకనం',
            nav_availability: 'లభ్యత',
            nav_bookings: 'బుకింగ్‌లు',
            nav_history: 'బుకింగ్ చరిత్ర',
            nav_reports: 'నివేదికలు & విశ్లేషణలు',
            nav_profile: 'ప్రొఫైల్‌ను నవీకరించండి',
            header_logout: 'లాగ్ అవుట్',
            header_back_to_home: 'హోమ్‌కు తిరిగి వెళ్లండి', // NEW TRANSLATION
            overview_heading: 'డాష్‌బోర్డ్ అవలోకనం',
            stats_heading: 'ఆదాయాలు & గణాంకాలు',
            stats_totalBookings: 'మొత్తం బుకింగ్‌లు',
            stats_earnings: 'ఈ రోజు వరకు ఆదాయాలు',
            stats_ratings: 'రేటింగ్‌లు',
            stats_reportsBtn: 'వివరణాత్మక నివేదికలు చూడండి',
            availability_heading_short: 'ప్రస్తుత లభ్యత',
            availability_heading_long: 'లభ్యతను నిర్వహించండి',
            availability_status_on: 'అందుబాటులో ఉంది',
            availability_status_off: 'అందుబాటులో లేదు',
            availability_info_short: 'కొత్త సేవా అభ్యర్థనల కోసం మీ లభ్యతను నవీకరించండి.',
            availability_info_long: "కొత్త సేవా అభ్యర్థనల కోసం మీరు అందుబాటులో ఉన్నారని వినియోగదారులకు తెలియజేయడానికి ఈ స్విచ్‌ను టోగుల్ చేయండి. మీ స్థితి వెంటనే అప్‌డేట్ అవుతుంది.",
            bookings_heading_short: 'శీఘ్ర వీక్షణ: రాబోయే బుకింగ్‌లు',
            bookings_heading_long: 'రాబోయే & క్రియాశీల బుకింగ్‌లు',
            bookings_customer: 'వినియోగదారు:',
            bookings_service: 'సేవ:',
            bookings_dateTime: 'తేదీ & సమయం:',
            bookings_contactBtn: 'సంప్రదించండి',
            bookings_completeBtn: 'పూర్తయినట్లుగా గుర్తించండి',
            bookings_viewAllBtn: 'అన్ని బుకింగ్‌లు చూడండి',
            bookings_noUpcoming: 'రాబోయే బుకింగ్‌లు లేవు.',
            history_heading: 'బుకింగ్ చరిత్ర',
            history_filterDate: 'తేదీ వారీగా ఫిల్టర్ చేయండి:',
            history_filterService: 'సేవా రకం:',
            history_filterStatus: 'స్థితి:',
            history_applyBtn: 'ఫిల్టర్లను వర్తింపజేయండి',
            history_downloadBtn: 'నివేదికలు డౌన్‌లోడ్ చేయండి',
            history_noHistory: 'ప్రస్తుత ఫిల్టర్‌లతో గత బుకింగ్‌లు కనుగొనబడలేదు.',
            history_status_completed: 'పూర్తయింది',
            history_status_cancelled: 'రద్దు చేయబడింది',
            history_status_all: 'అన్నీ',
            reports_heading: 'నివేదికలు & విశ్లేషణలు',
            reports_snapshot: 'మీ పనితీరు స్నాప్‌షాట్',
            reports_chartTitle: 'సేవా వర్గం ద్వారా పూర్తయిన బుకింగ్‌లు',
            reports_chartDesc: 'ఈ చార్ట్ గత 30 రోజులలో సేవా వర్గం వారీగా మీ పూర్తయిన బుకింగ్‌ల శాతాన్ని చూపుతుంది.',
            reports_growthHeading: 'వృద్ది ప్రణాళిక & అంతర్దృష్టులు',
            reports_insights: 'మీ ఇటీవలి పనితీరు ఆధారంగా, మీ ఆదాయాలు మరియు రేటింగ్‌లను పెంచడానికి ఇక్కడ కొన్ని అంతర్దృష్టులు మరియు సిఫార్సులు ఉన్నాయి:',
            reports_exploreBtn: 'మార్కెటింగ్ సాధనాలను అన్వేషించండి',
            profile_heading: 'ప్రొఫైల్‌ను నవీకరించండి',
            profile_details: 'వ్యక్తిగత & సేవా వివరాలు',
            profile_name: 'పేరు',
            profile_serviceCategory: 'సేవా వర్గం',
            profile_phone: 'ఫోన్ నంబర్',
            profile_languages: 'సమర్థిత భాషలు',
            profile_currentPass: 'ప్రస్తుత పాస్‌వర్డ్',
            profile_newPass: 'కొత్త పాస్‌వర్డ్',
            profile_confirmPass: 'కొత్త పాస్‌వర్డ్‌ను నిర్ధారించండి',
            profile_saveBtn: 'మార్పులను సేవ్ చేయండి',
            profile_passMismatch: 'కొత్త పాస్‌వర్డ్ మరియు నిర్ధారించు పాస్‌వర్డ్ సరిపోలడం లేదు!',
            profile_success: 'ప్రొఫైల్ వివరాలు విజయవంతంగా నవీకరించబడ్డాయి!',
            chat_heading: 'తో చాట్ చేయండి ',
            chat_inputPlaceholder: 'మీ సందేశాన్ని టైప్ చేయండి లేదా ఒక ఎంపికను ఎంచుకోండి...',
            chat_sendBtn: 'పంపండి',
            chat_quickOnMyWay: 'నేను దారిలో ఉన్నాను!',
            chat_quick15min: '15 నిమిషాల్లో అక్కడ ఉంటాను',
            chat_quickJobDone: 'పని పూర్తయింది',
            chat_quickMoreDetails: 'మరిన్ని వివరాలు కావాలి',
            chat_info: "మీరు దీనితో చాట్ చేస్తున్నారు",
            alert_availabilityOn: 'మీ లభ్యత ఇప్పుడు ఆన్ చేయబడింది.',
            alert_availabilityOff: 'మీ లభ్యత ఇప్పుడు ఆఫ్ చేయబడింది.',
            alert_logout: 'లాగ్ అవుట్ అయ్యారు! (అనుకరణ)',
            alert_completeSuccess: 'బుకింగ్ పూర్తయినట్లుగా గుర్తించబడింది!',
            alert_completeFail: 'బుకింగ్‌ను పూర్తి చేయడంలో విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి।',
            alert_mic: 'మైక్రోఫోన్ సక్రియం చేయబడింది! (అనుకరణ)'
        },
        ta: {
            nav_overview: 'டாஷ்போர்டு கண்ணோட்டம்',
            nav_availability: 'கிடைக்கும் நிலை',
            nav_bookings: 'புக்கிங்ஸ்',
            nav_history: 'புக்கிங் வரலாறு',
            nav_reports: 'அறிக்கைகள் மற்றும் பகுப்பாய்வு',
            nav_profile: 'சுயவிவரத்தை புதுப்பிக்கவும்',
            header_logout: 'வெளியேறு',
            header_back_to_home: 'முகப்புக்குத் திரும்பு', // NEW TRANSLATION
            overview_heading: 'டாஷ்போர்டு கண்ணோட்டம்',
            stats_heading: 'வருவாய் மற்றும் புள்ளிவிவரங்கள்',
            stats_totalBookings: 'மொத்த புக்கிங்ஸ்',
            stats_earnings: 'இன்றைய தேதி வரை வருவாய்',
            stats_ratings: 'மதிப்பீடுகள்',
            stats_reportsBtn: 'விரிவான அறிக்கைகளைப் பார்க்கவும்',
            availability_heading_short: 'தற்போதைய கிடைக்கும் நிலை',
            availability_heading_long: 'கிடைக்கும் நிலையை நிர்வகிக்கவும்',
            availability_status_on: 'கிடைக்கிறது',
            availability_status_off: 'கிடைக்கவில்லை',
            availability_info_short: 'புதிய சேவை கோரிக்கைகளுக்காக உங்கள் கிடைக்கும் நிலையை புதுப்பிக்கவும்.',
            availability_info_long: "புதிய சேவை கோரிக்கைகளுக்கு நீங்கள் தயாராக உள்ளீர்களா என்பதை வாடிக்கையாளர்களுக்குத் தெரிவிக்க இந்த சுவிட்சை மாற்றவும். உங்கள் நிலை உடனடியாக புதுப்பிக்கப்படும்.",
            bookings_heading_short: 'விரைவான பார்வை: வரவிருக்கும் புக்கிங்ஸ்',
            bookings_heading_long: 'வரவிருக்கும் மற்றும் செயலில் உள்ள புக்கிங்ஸ்',
            bookings_customer: 'வாடிக்கையாளர்:',
            bookings_service: 'சேவை:',
            bookings_dateTime: 'தேதி மற்றும் நேரம்:',
            bookings_contactBtn: 'தொடர்பு கொள்ளவும்',
            bookings_completeBtn: 'பூர்த்தி செய்யப்பட்டது எனக் குறிக்கவும்',
            bookings_viewAllBtn: 'அனைத்து புக்கிங்ஸையும் பார்க்கவும்',
            bookings_noUpcoming: 'வரவிருக்கும் புக்கிங்ஸ் இல்லை.',
            history_heading: 'புக்கிங் வரலாறு',
            history_filterDate: 'தேதியின்படி வடிகட்டவும்:',
            history_filterService: 'சேவை வகை:',
            history_filterStatus: 'நிலை:',
            history_applyBtn: 'வடிகட்டியைப் பயன்படுத்து',
            history_downloadBtn: 'அறிக்கைகளை பதிவிறக்கவும்',
            history_noHistory: 'தற்போதைய வடிகட்டிகளுடன் கடந்த புக்கிங்ஸ் எதுவும் இல்லை.',
            history_status_completed: 'பூர்த்தி செய்யப்பட்டது',
            history_status_cancelled: 'ரத்து செய்யப்பட்டது',
            history_status_all: 'அனைத்தும்',
            reports_heading: 'அறிக்கைகள் மற்றும் பகுப்பாய்வு',
            reports_snapshot: 'உங்கள் செயல்திறன் ஸ்னாப்ஷாட்',
            reports_chartTitle: 'சேவை வகை மூலம் பூர்த்தி செய்யப்பட்ட புக்கிங்ஸ்',
            reports_chartDesc: 'இந்த விளக்கப்படம் கடந்த 30 நாட்களில் சேவை வகை மூலம் உங்கள் பூர்த்தி செய்யப்பட்ட புக்கிங்ஸின் சதவீதத்தைக் காட்டுகிறது.',
            reports_growthHeading: 'வளர்ச்சித் திட்டம் மற்றும் நுண்ணறிவுகள்',
            reports_insights: 'உங்கள் சமீபத்திய செயல்திறனின் அடிப்படையில், உங்கள் வருவாய் மற்றும் மதிப்பீடுகளை அதிகரிக்க சில நுண்ணறிவுகள் மற்றும் பரிந்துரைகள் இங்கே உள்ளன:',
            reports_exploreBtn: 'சந்தைப்படுத்தல் கருவிகளை ஆராயுங்கள்',
            profile_heading: 'சுயவிவரத்தை புதுப்பிக்கவும்',
            profile_details: 'தனிப்பட்ட மற்றும் சேவை விவரங்கள்',
            profile_name: 'பெயர்',
            profile_serviceCategory: 'சேவை வகை',
            profile_phone: 'தொலைபேசி எண்',
            profile_languages: 'ஆதரவு மொழிகள்',
            profile_currentPass: 'தற்போதைய கடவுச்சொல்',
            profile_newPass: 'புதிய கடவுச்சொல்',
            profile_confirmPass: 'புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்',
            profile_saveBtn: 'மாற்றங்களை சேமிக்கவும்',
            profile_passMismatch: 'புதிய கடவுச்சொல்லும் உறுதிப்படுத்தும் கடவுச்சொல்லும் பொருந்தவில்லை!',
            profile_success: 'சுயவிவர விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!',
            chat_heading: 'உடன் அரட்டை அடிக்கவும் ',
            chat_inputPlaceholder: 'உங்கள் செய்தியை தட்டச்சு செய்யவும் அல்லது ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்...',
            chat_sendBtn: 'அனுப்பு',
            chat_quickOnMyWay: 'நான் வழியில் இருக்கிறேன்!',
            chat_quick15min: '15 நிமிடங்களில் அங்கு வருவேன்',
            chat_quickJobDone: 'வேலை முடிந்தது',
            chat_quickMoreDetails: 'மேலும் விவரங்கள் தேவை',
            chat_info: "நீங்கள் இவருடன் அரட்டை அடிக்கிறீர்கள்",
            alert_availabilityOn: 'உங்கள் கிடைக்கும் நிலை இப்போது இயக்கப்பட்டுள்ளது.',
            alert_availabilityOff: 'உங்கள் கிடைக்கும் நிலை இப்போது நிறுத்தப்பட்டுள்ளது.',
            alert_logout: 'வெளியேறிவிட்டீர்கள்! (போலியானது)',
            alert_completeSuccess: 'புக்கிங் பூர்த்தி செய்யப்பட்டது எனக் குறிக்கப்பட்டது!',
            alert_completeFail: 'புக்கிங்கை பூர்த்தி செய்ய முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
            alert_mic: 'மைக்ரோஃபோன் செயல்படுத்தப்பட்டது! (போலியானது)'
        },
        bn: {
            nav_overview: 'ড্যাশবোর্ড ওভারভিউ',
            nav_availability: 'উপলভ্যতা',
            nav_bookings: 'বুকিং',
            nav_history: 'বুকিং ইতিহাস',
            nav_reports: 'রিপোর্ট এবং অ্যানালিটিক্স',
            nav_profile: 'প্রোফাইল আপডেট করুন',
            header_logout: 'লগ আউট',
            header_back_to_home: 'হোমে ফিরে যান', // NEW TRANSLATION
            overview_heading: 'ড্যাশবোর্ড ওভারভিউ',
            stats_heading: 'আয় ও পরিসংখ্যান',
            stats_totalBookings: 'মোট বুকিং',
            stats_earnings: 'আজ পর্যন্ত আয়',
            stats_ratings: 'রেটিং',
            stats_reportsBtn: 'বিস্তারিত রিপোর্ট দেখুন',
            availability_heading_short: 'বর্তমান উপলভ্যতা',
            availability_heading_long: 'উপলভ্যতা পরিচালনা করুন',
            availability_status_on: 'উপলব্ধ',
            availability_status_off: 'অনুপলব্ধ',
            availability_info_short: 'নতুন পরিষেবা অনুরোধের জন্য আপনার উপলভ্যতা আপডেট করুন।',
            availability_info_long: "গ্রাহকদের নতুন পরিষেবা অনুরোধের জন্য আপনি উপলব্ধ কিনা তা জানাতে এই সুইচটি টগল করুন। আপনার স্ট্যাটাস অবিলম্বে আপডেট হবে।",
            bookings_heading_short: 'দ্রুত দেখা: আসন্ন বুকিং',
            bookings_heading_long: 'আসন্ন এবং সক্রিয় বুকিং',
            bookings_customer: 'গ্রাহক:',
            bookings_service: 'পরিষেবা:',
            bookings_dateTime: 'তারিখ ও সময়:',
            bookings_contactBtn: 'যোগাযোগ',
            bookings_completeBtn: 'সম্পন্ন হিসাবে চিহ্নিত করুন',
            bookings_viewAllBtn: 'সমস্ত বুকিং দেখুন',
            bookings_noUpcoming: 'কোনো আসন্ন বুকিং নেই।',
            history_heading: 'বুকিং ইতিহাস',
            history_filterDate: 'তারিখ দ্বারা ফিল্টার করুন:',
            history_filterService: 'পরিষেবার ধরন:',
            history_filterStatus: 'স্ট্যাটাস:',
            history_applyBtn: 'ফিল্টার প্রয়োগ করুন',
            history_downloadBtn: 'রিপোর্ট ডাউনলোড করুন',
            history_noHistory: 'বর্তমান ফিল্টার সহ কোনো অতীত বুকিং পাওয়া যায়নি।',
            history_status_completed: 'সম্পন্ন',
            history_status_cancelled: 'বাতিল',
            history_status_all: 'সব',
            reports_heading: 'রিপোর্ট এবং অ্যানালিটিক্স',
            reports_snapshot: 'আপনার পারফরম্যান্সের স্ন্যাপশট',
            reports_chartTitle: 'পরিষেবা বিভাগ দ্বারা সম্পন্ন বুকিং',
            reports_chartDesc: 'এই চার্টটি গত 30 দিনের মধ্যে পরিষেবা বিভাগ দ্বারা আপনার সম্পন্ন বুকিং এর শতাংশ দেখায়।',
            reports_growthHeading: 'বৃদ্ধি পরিকল্পনা এবং অন্তর্দৃষ্টি',
            reports_insights: 'আপনার সাম্প্রতিক পারফরম্যান্সের উপর ভিত্তি করে, আপনার আয় এবং রেটিং বাড়ানোর জন্য এখানে কিছু অন্তর্দৃষ্টি এবং সুপারিশ রয়েছে:',
            reports_exploreBtn: 'মার্কেটিং সরঞ্জাম অন্বেষণ করুন',
            profile_heading: 'প্রোফাইল আপডেট করুন',
            profile_details: 'ব্যক্তিগত এবং পরিষেবার বিবরণ',
            profile_name: 'নাম',
            profile_serviceCategory: 'পরিষেবা বিভাগ',
            profile_phone: 'ফোন নম্বর',
            profile_languages: 'সমর্থিত ভাষা',
            profile_currentPass: 'বর্তমান পাসওয়ার্ড',
            profile_newPass: 'নতুন পাসওয়ার্ড',
            profile_confirmPass: 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
            profile_saveBtn: 'পরিবর্তন সংরক্ষণ করুন',
            profile_passMismatch: 'নতুন পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মেলেনি!',
            profile_success: 'প্রোফাইল বিবরণ সফলভাবে আপডেট করা হয়েছে!',
            chat_heading: 'এর সাথে চ্যাট করুন ',
            chat_inputPlaceholder: 'আপনার বার্তা টাইপ করুন বা একটি বিকল্প নির্বাচন করুন...',
            chat_sendBtn: 'পাঠান',
            chat_quickOnMyWay: 'আমি পথে আছি!',
            chat_quick15min: '15 মিনিটের মধ্যে পৌঁছাব',
            chat_quickJobDone: 'কাজ শেষ',
            chat_quickMoreDetails: 'আরো বিবরণ প্রয়োজন',
            chat_info: "আপনি এর সাথে চ্যাট করছেন",
            alert_availabilityOn: 'আপনার উপলভ্যতা এখন চালু আছে।',
            alert_availabilityOff: 'আপনার উপলভ্যতা এখন বন্ধ আছে।',
            alert_logout: 'লগ আউট করা হয়েছে! (সিমুলেটেড)',
            alert_completeSuccess: 'বুকিং সম্পন্ন হিসাবে চিহ্নিত করা হয়েছে!',
            alert_completeFail: 'বুকিং সম্পন্ন করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
            alert_mic: 'মাইক্রোফোন সক্রিয়! (সিমুলেটেড)'
        }
    };
    
    const updateLanguage = (lang) => {
        const t = TRANSLATIONS[lang];
        if (!t) return;
        
        const navOverview = document.querySelector('[data-section="overview"]');
        if (navOverview) navOverview.textContent = t.nav_overview;
        const navAvailability = document.querySelector('[data-section="availability"]');
        if (navAvailability) navAvailability.textContent = t.nav_availability;
        const navBookings = document.querySelector('[data-section="bookings"]');
        if (navBookings) navBookings.textContent = t.nav_bookings;
        const navHistory = document.querySelector('[data-section="history"]');
        if (navHistory) navHistory.textContent = t.nav_history;
        const navReports = document.querySelector('[data-section="reports"]');
        if (navReports) navReports.textContent = t.nav_reports;
        const navProfile = document.querySelector('[data-section="profile"]');
        if (navProfile) navProfile.textContent = t.nav_profile;
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) logoutBtn.textContent = t.header_logout;
        const backToHomeBtn = document.getElementById('back-to-home-btn');
        if (backToHomeBtn) backToHomeBtn.textContent = t.header_back_to_home;

        const overviewH2 = document.querySelector('#overview h2');
        if (overviewH2) overviewH2.textContent = t.overview_heading;
        const statsH3 = document.querySelector('.stats-panel h3');
        if (statsH3) statsH3.textContent = t.stats_heading;
        const totalBookingsLabel = document.querySelector('.stats-grid .stat-item:nth-child(1) .stat-label');
        if (totalBookingsLabel) totalBookingsLabel.textContent = t.stats_totalBookings;
        const earningsLabel = document.querySelector('.stats-grid .stat-item:nth-child(2) .stat-label');
        if (earningsLabel) earningsLabel.textContent = t.stats_earnings;
        const ratingsLabel = document.querySelector('.stats-grid .stat-item:nth-child(3) .stat-label');
        if (ratingsLabel) ratingsLabel.textContent = t.stats_ratings;
        if (viewReportsBtn) viewReportsBtn.textContent = t.stats_reportsBtn;
        const availabilityH3 = document.querySelector('.availability-panel h3');
        if (availabilityH3) availabilityH3.textContent = t.availability_heading_short;
        const quickBookingsH3 = document.querySelector('.quick-bookings h3');
        if (quickBookingsH3) quickBookingsH3.textContent = t.bookings_heading_short;
        if (viewAllBookingsBtn) viewAllBookingsBtn.textContent = t.bookings_viewAllBtn;
        const smallText = document.querySelector('.availability-panel p.small-text');
        if (smallText) smallText.textContent = t.availability_info_short;
        
        const availabilityH2 = document.querySelector('#availability h2');
        if (availabilityH2) availabilityH2.textContent = t.nav_availability;
        const availabilityPanelH3 = document.querySelector('#availability .availability-panel h3');
        if (availabilityPanelH3) availabilityPanelH3.textContent = t.availability_heading_long;
        const infoText = document.querySelector('.info-text');
        if (infoText) infoText.textContent = t.availability_info_long;
        
        const bookingsH2 = document.querySelector('#bookings h2');
        if (bookingsH2) bookingsH2.textContent = t.bookings_heading_long;
        const bookingsPanelH3 = document.querySelector('.bookings-panel h3');
        if (bookingsPanelH3) bookingsPanelH3.textContent = t.bookings_heading_long;

        const historyH2 = document.querySelector('#history h2');
        if (historyH2) historyH2.textContent = t.history_heading;
        const filterDateLabel = document.querySelector('.booking-history-panel .filters label[for="history-filter-date"]');
        if (filterDateLabel) filterDateLabel.textContent = t.history_filterDate;
        const filterServiceLabel = document.querySelector('.booking-history-panel .filters label[for="history-filter-service"]');
        if (filterServiceLabel) filterServiceLabel.textContent = t.history_filterService;
        const filterStatusLabel = document.querySelector('.booking-history-panel .filters label[for="history-filter-status"]');
        if (filterStatusLabel) filterStatusLabel.textContent = t.history_filterStatus;
        const applyFiltersBtn = document.querySelector('.booking-history-panel .filters .btn-secondary');
        if (applyFiltersBtn) applyFiltersBtn.textContent = t.history_applyBtn;
        const downloadReportsBtn = document.querySelector('.booking-history-panel .btn-link');
        if (downloadReportsBtn) downloadReportsBtn.textContent = t.history_downloadBtn;
        
        const serviceAll = document.querySelector('#history-filter-service option[value=""]');
        if (serviceAll) serviceAll.textContent = t.history_status_all;
        const statusAll = document.querySelector('#history-filter-status option[value=""]');
        if (statusAll) statusAll.textContent = t.history_status_all;
        const statusCompleted = document.querySelector('#history-filter-status option[value="Completed"]');
        if (statusCompleted) statusCompleted.textContent = t.history_status_completed;
        const statusCancelled = document.querySelector('#history-filter-status option[value="Cancelled"]');
        if (statusCancelled) statusCancelled.textContent = t.history_status_cancelled;

        const reportsH2 = document.querySelector('#reports h2');
        if (reportsH2) reportsH2.textContent = t.reports_heading;
        const snapshotH3 = document.querySelector('.analytics-overview h3');
        if (snapshotH3) snapshotH3.textContent = t.reports_snapshot;
        const chartH4 = document.querySelector('.chart-details h4');
        if (chartH4) chartH4.textContent = t.reports_chartTitle;
        const chartP = document.querySelector('.chart-details p');
        if (chartP) chartP.textContent = t.reports_chartDesc;
        const growthH3 = document.querySelector('.growth-plan-card h3');
        if (growthH3) growthH3.textContent = t.reports_growthHeading;
        const insightsP = document.querySelector('.growth-plan-card p');
        if (insightsP) insightsP.textContent = t.reports_insights;
        const exploreBtn = document.querySelector('.growth-plan-card .btn-primary');
        if (exploreBtn) exploreBtn.textContent = t.reports_exploreBtn;

        const profileH2 = document.querySelector('#profile h2');
        if (profileH2) profileH2.textContent = t.profile_heading;
        const detailsH3 = document.querySelector('.profile-update-panel h3');
        if (detailsH3) detailsH3.textContent = t.profile_details;
        const nameLabel = document.querySelector('.profile-form .form-group:nth-child(1) label');
        if (nameLabel) nameLabel.textContent = t.profile_name;
        const serviceLabel = document.querySelector('.profile-form .form-group:nth-child(2) label');
        if (serviceLabel) serviceLabel.textContent = t.profile_serviceCategory;
        const phoneLabel = document.querySelector('.profile-form .form-group:nth-child(3) label');
        if (phoneLabel) phoneLabel.textContent = t.profile_phone;
        const languagesLabel = document.querySelector('.profile-form .form-group:nth-child(4) label');
        if (languagesLabel) languagesLabel.textContent = t.profile_languages;
        const currentPassLabel = document.querySelector('.profile-form .form-group:nth-child(5) label');
        if (currentPassLabel) currentPassLabel.textContent = t.profile_currentPass;
        const newPassLabel = document.querySelector('.profile-form .form-group:nth-child(6) label');
        if (newPassLabel) newPassLabel.textContent = t.profile_newPass;
        const confirmPassLabel = document.querySelector('.profile-form .form-group:nth-child(7) label');
        if (confirmPassLabel) confirmPassLabel.textContent = t.profile_confirmPass;
        const saveBtn = document.querySelector('.profile-form .btn-primary');
        if (saveBtn) saveBtn.textContent = t.profile_saveBtn;

        if (chatModal) {
            const chatH4 = document.querySelector('#chat-modal h4');
            if (chatH4) chatH4.textContent = t.chat_heading;
            if (chatTextInput) chatTextInput.placeholder = t.chat_inputPlaceholder;
            const sendBtn = document.querySelector('#chat-form button[type="submit"]');
            if (sendBtn) sendBtn.textContent = t.chat_sendBtn;
            if (document.querySelector('[data-message="On my way!"]')) document.querySelector('[data-message="On my way!"]').textContent = t.chat_quickOnMyWay;
            if (document.querySelector('[data-message="Will be there in 15 mins."')) document.querySelector('[data-message="Will be there in 15 mins."]').textContent = t.chat_quick15min;
            if (document.querySelector('[data-message="Finished the job."')) document.querySelector('[data-message="Finished the job."]').textContent = t.chat_quickJobDone;
            if (document.querySelector('[data-message="I need more details."')) document.querySelector('[data-message="I need more details."]').textContent = t.chat_quickMoreDetails;
        }
        
        renderBookings(upcomingBookingsListOverview, mockBookings.filter(b => b.status === 'upcoming').slice(0, 2));
        renderBookings(upcomingBookingsListFull, mockBookings.filter(b => b.status === 'upcoming'));
        renderBookingHistory(mockBookings.filter(b => b.status === 'completed' || b.status === 'cancelled'));
    };

    const initializeDashboard = () => {
        const storedName = localStorage.getItem('workerName');
        if (storedName && workerNameDisplay) {
            workerNameDisplay.textContent = storedName;
        } else if (workerNameDisplay) {
            workerNameDisplay.textContent = 'John Smith';
        }
        
        const profilePic = document.querySelector('.profile-pic');
        if (profilePic) profilePic.src = 'https://img.freepik.com/premium-vector/cartoon-character-vector-illustration_1128655-324.jpg?w=2000';

        if (availabilityToggleOverview) availabilityToggleOverview.checked = registeredWorkerData.isAvailable;
        if (availabilityStatusTextOverview) availabilityStatusTextOverview.textContent = registeredWorkerData.isAvailable ? TRANSLATIONS.en.availability_status_on : TRANSLATIONS.en.availability_status_off;
        if (availabilityToggleLarge) availabilityToggleLarge.checked = registeredWorkerData.isAvailable;
        if (availabilityStatusTextLarge) availabilityStatusTextLarge.textContent = registeredWorkerData.isAvailable ? TRANSLATIONS.en.availability_status_on : TRANSLATIONS.en.availability_status_off;

        if (totalBookings) totalBookings.textContent = mockStats.totalBookings;
        if (totalEarnings) totalEarnings.textContent = mockStats.earningsToDate;
        if (workerRatings) workerRatings.textContent = mockStats.ratings;

        if (upcomingBookingsListOverview) renderBookings(upcomingBookingsListOverview, mockBookings.filter(b => b.status === 'upcoming').slice(0, 2));
        if (upcomingBookingsListFull) renderBookings(upcomingBookingsListFull, mockBookings.filter(b => b.status === 'upcoming'));
        if (bookingHistoryList) renderBookingHistory(mockBookings.filter(b => b.status === 'completed' || b.status === 'cancelled'));

        if (profileWorkerName) profileWorkerName.value = registeredWorkerData.name;
        if (profileServiceCategory) profileServiceCategory.value = registeredWorkerData.serviceCategory;
        if (profilePhoneNumber) profilePhoneNumber.value = registeredWorkerData.phoneNumber;
        if (profileLanguagesSupported) profileLanguagesSupported.value = registeredWorkerData.languages;

        if (document.getElementById('bookingsPieChart')) initializeBookingsPieChart();
        showSection('overview');

        const savedLang = localStorage.getItem('appLanguage') || 'en';
        if (languageDropdown) languageDropdown.value = savedLang;
        updateLanguage(savedLang);
    };
    
    const showSection = (sectionId) => {
        if (navItems) {
            navItems.forEach(item => {
                if (item.dataset.section === sectionId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        if (dashboardSections) {
            dashboardSections.forEach(section => {
                if (section.id === sectionId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        }
    };
    
    const renderBookings = (container, bookings) => {
        if (!container) return;
        container.innerHTML = '';
        const currentLang = languageDropdown ? languageDropdown.value : 'en';
        const t = TRANSLATIONS[currentLang];
        
        if (bookings.length === 0) {
            container.innerHTML = `<p class="info-text">${t.bookings_noUpcoming}</p>`;
            return;
        }
        bookings.forEach(booking => {
            const bookingCard = document.createElement('div');
            bookingCard.classList.add('booking-card');
            bookingCard.dataset.bookingId = booking.id;
            bookingCard.dataset.customerName = booking.customerName;
            bookingCard.innerHTML = `
                <div class="booking-details">
                    <p><strong>${t.bookings_customer}</strong> ${booking.customerName}</p>
                    <p><strong>${t.bookings_service}</strong> ${booking.service}</p>
                    <p><strong>${t.bookings_dateTime}</strong> ${booking.dateTime}</p>
                </div>
                <div class="booking-actions">
                    <button class="btn-secondary contact-btn">${t.bookings_contactBtn}</button>
                    <button class="btn-primary complete-btn">${t.bookings_completeBtn}</button>
                </div>
            `;
            container.appendChild(bookingCard);
        });
    };

    const renderBookingHistory = (historyBookings) => {
        if (!bookingHistoryList) return;
        bookingHistoryList.innerHTML = '';
        const currentLang = languageDropdown ? languageDropdown.value : 'en';
        const t = TRANSLATIONS[currentLang];
        
        if (historyBookings.length === 0) {
            bookingHistoryList.innerHTML = `<p class="info-text">${t.history_noHistory}</p>`;
            return;
        }
        historyBookings.forEach(booking => {
            const historyCard = document.createElement('div');
            historyCard.classList.add('booking-card');
            historyCard.innerHTML = `
                <div class="booking-details">
                    <p><strong>${t.bookings_customer}</strong> ${booking.customerName}</p>
                    <p><strong>${t.bookings_service}</strong> ${booking.service}</p>
                    <p><strong>${t.bookings_dateTime}</strong> ${booking.dateTime}</p>
                    <p><strong>${t.history_filterStatus}</strong> <span class="status-${booking.status}">${t[`history_status_${booking.status}`]}</span></p>
                </div>
            `;
            bookingHistoryList.appendChild(historyCard);
        });
    };
    
    const openChatModal = (customerName, bookingId) => {
        if (!chatModal) return;
        chatModal.style.display = 'flex';
        if (chatCustomerName) chatCustomerName.textContent = customerName;
        if (chatMessagesContainer) chatMessagesContainer.innerHTML = '';
        
        const currentLang = languageDropdown ? languageDropdown.value : 'en';
        const t = TRANSLATIONS[currentLang];
        
        const history = mockChatHistory[bookingId] || [];
        history.forEach(msg => appendChatMessage(msg.message, msg.sender === 'worker' ? 'worker-message' : 'customer-message'));

        if (history.length === 0) {
            appendChatMessage(`${t.chat_info} ${customerName}.`, 'customer-message');
        }
    };

    const appendChatMessage = (message, senderClass) => {
        if (!chatMessagesContainer) return;
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', senderClass);
        messageElement.textContent = message;
        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    };
    
    const initializeBookingsPieChart = () => {
        const ctx = document.getElementById('bookingsPieChart');
        if (!ctx) return;

        if (bookingsPieChartInstance) {
            bookingsPieChartInstance.destroy();
        }
        
        const currentLang = languageDropdown ? languageDropdown.value : 'en';
        const t = TRANSLATIONS[currentLang];

        const serviceCounts = {};
        mockBookings.filter(b => b.status === 'completed').forEach(booking => {
            serviceCounts[booking.service] = (serviceCounts[booking.service] || 0) + 1;
        });

        const labels = Object.keys(serviceCounts);
        const data = Object.values(serviceCounts);

        const backgroundColors = [
            '#F8BBD0', '#D7BDE2', '#EC7063', '#82E0AA', '#F1C40F', '#A3B18A'
        ];

        bookingsPieChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'var(--text-color)'
                        }
                    },
                    title: {
                        display: true,
                        text: t.reports_chartTitle,
                        color: 'var(--text-color)'
                    }
                }
            }
        });
    };
    
    const markBookingAsCompleted = async (bookingId) => {
        const currentLang = languageDropdown ? languageDropdown.value : 'en';
        const t = TRANSLATIONS[currentLang];
        
        mockBookings = mockBookings.map(b => b.id === bookingId ? { ...b, status: 'completed' } : b);
        mockStats.totalBookings = mockBookings.filter(b => b.status === 'completed').length;
        mockStats.earningsToDate = '$' + (mockStats.totalBookings * 150).toLocaleString();
        initializeDashboard();
        alert(t.alert_completeSuccess);
    };
    
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    if (languageDropdown) {
        languageDropdown.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            localStorage.setItem('appLanguage', selectedLang);
            updateLanguage(selectedLang);
            if (document.querySelector('#reports.active')) {
                initializeBookingsPieChart();
            }
        });
    }

    if (navItems) {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = e.target.dataset.section;
                showSection(sectionId);
                if (sectionId === 'reports') {
                    initializeBookingsPieChart();
                }
            });
        });
    }
    
    if (viewReportsBtn) {
        viewReportsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('reports');
            initializeBookingsPieChart();
        });
    }

    if (viewAllBookingsBtn) {
        viewAllBookingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('bookings');
        });
    }

    if (availabilityToggleOverview) {
        availabilityToggleOverview.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            if (availabilityToggleLarge) availabilityToggleLarge.checked = isChecked;
            const statusText = isChecked ? TRANSLATIONS[languageDropdown.value].availability_status_on : TRANSLATIONS[languageDropdown.value].availability_status_off;
            if (availabilityStatusTextOverview) availabilityStatusTextOverview.textContent = statusText;
            if (availabilityStatusTextLarge) availabilityStatusTextLarge.textContent = statusText;
            localStorage.setItem('workerAvailability', isChecked);
            alert(isChecked ? TRANSLATIONS[languageDropdown.value].alert_availabilityOn : TRANSLATIONS[languageDropdown.value].alert_availabilityOff);
        });
    }

    if (availabilityToggleLarge) {
        availabilityToggleLarge.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            if (availabilityToggleOverview) availabilityToggleOverview.checked = isChecked;
            const statusText = isChecked ? TRANSLATIONS[languageDropdown.value].availability_status_on : TRANSLATIONS[languageDropdown.value].availability_status_off;
            if (availabilityStatusTextOverview) availabilityStatusTextOverview.textContent = statusText;
            if (availabilityStatusTextLarge) availabilityStatusTextLarge.textContent = statusText;
            localStorage.setItem('workerAvailability', isChecked);
            alert(isChecked ? TRANSLATIONS[languageDropdown.value].alert_availabilityOn : TRANSLATIONS[languageDropdown.value].alert_availabilityOff);
        });
    }

    document.addEventListener('click', (e) => {
        const bookingCard = e.target.closest('.booking-card');
        if (!bookingCard) return;

        const bookingId = bookingCard.dataset.bookingId;
        const customerName = bookingCard.dataset.customerName;

        if (e.target.classList.contains('contact-btn')) {
            openChatModal(customerName, bookingId);
        } else if (e.target.classList.contains('complete-btn')) {
            markBookingAsCompleted(bookingId);
        }
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (chatModal) chatModal.style.display = 'none';
        });
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatTextInput.value.trim();
            if (message) {
                appendChatMessage(message, 'worker-message');
                chatTextInput.value = '';
            }
        });
    }

    if (chatQuickOptions) {
        chatQuickOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-option-btn')) {
                const message = e.target.dataset.message;
                appendChatMessage(message, 'worker-message');
                chatTextInput.value = '';
            }
        });
    }

    if (microphoneBtn) {
        microphoneBtn.addEventListener('click', () => {
            alert(TRANSLATIONS[languageDropdown.value].alert_mic);
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedProfile = {
                name: profileWorkerName.value,
                serviceCategory: profileServiceCategory.value,
                phoneNumber: profilePhoneNumber.value,
                languages: profileLanguagesSupported.value,
            };

            if (newPassword.value) {
                if (newPassword.value !== confirmPassword.value) {
                    alert(TRANSLATIONS[languageDropdown.value].profile_passMismatch);
                    return;
                }
            }
            alert(TRANSLATIONS[languageDropdown.value].profile_success);
            if (workerNameDisplay) workerNameDisplay.textContent = updatedProfile.name;
            localStorage.setItem('workerName', updatedProfile.name);
        });
    }

    if (logoutButtons) {
        logoutButtons.forEach(button => {
            button.addEventListener('click', () => {
                alert(TRANSLATIONS[languageDropdown.value].alert_logout);
                localStorage.clear();
                window.location.href = 'index.html'; // Corrected redirection
            });
        });
    }

    initializeDashboard();
});