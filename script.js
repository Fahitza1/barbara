// Anonymous Username Generator
const adjectives = ['Silent', 'Velvet', 'Lunar', 'Neon', 'Cosmic', 'Mystic', 'Sonic', 'Electric', 'Phantom', 'Quantum', 'Twilight', 'Stellar', 'Ethereal', 'Radiant', 'Crimson', 'Obsidian', 'Aurora', 'Nexus', 'Zenith', 'Vortex'];
const nouns = ['Falcon', 'Orbit', 'Echo', 'Cobra', 'Phoenix', 'Dragon', 'Tiger', 'Wolf', 'Eagle', 'Shark', 'Storm', 'Thunder', 'Blaze', 'Frost', 'Pulse', 'Void', 'Matrix', 'Nova', 'Prism', 'Cipher'];

function generateAnonymousUsername() {
    const savedUsername = localStorage.getItem('bridgingFuturesUsername');
    if (savedUsername) {
        return savedUsername;
    }
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    const username = `${adjective}${noun}${number}`;
    
    localStorage.setItem('bridgingFuturesUsername', username);
    return username;
}

let currentUserUsername = generateAnonymousUsername();

// Landing page animation and navigation
document.addEventListener('DOMContentLoaded', function() {
    // Handle landing page overlay
    const landingOverlay = document.getElementById('landingOverlay');
    
    // Remove landing overlay after animation completes
    setTimeout(() => {
        if (landingOverlay) {
            landingOverlay.style.display = 'none';
        }
    }, 9000);

    // Initialize navigation
    initializeNavigation();
    
    // Initialize forum FIRST - load data before rendering
    initializeForum();
    
    // Render channels after forum is initialized
    renderChannels();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
            
            // Update active nav link
            navLinks.forEach(nl => nl.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
        }
    });
}

// Forum functionality
let currentChannel = 'general';
let channels = ['general', 'credit-help', 'loan-advice', 'apartment-hunting', 'success-stories'];

const channelDescriptions = {
    'general': 'General discussion, introductions, and community updates. Ask anything related to adulting!',
    'credit-help': 'Questions about building credit, understanding credit scores, and credit card strategies.',
    'loan-advice': 'Discuss student loans, repayment plans, and strategies for managing education debt.',
    'apartment-hunting': 'Share apartment hunting tips, ask about rental agreements, and discuss first-time renting experiences.',
    'success-stories': 'Celebrate wins! Share your financial wins, apartment hunting successes, and personal achievements.'
};

const channelCreators = {};

const defaultChannelMessages = {
    'general': [],
    'credit-help': [],
    'loan-advice': [],
    'apartment-hunting': [],
    'success-stories': []
};

let channelMessages = {};

// Initialize localStorage
function initializeLocalStorage() {
    // Check if messages exist in localStorage
    const savedMessages = localStorage.getItem('bridgingFuturesMessages');
    
    if (savedMessages) {
        try {
            channelMessages = JSON.parse(savedMessages);
        } catch (e) {
            console.error('Error parsing saved messages:', e);
            channelMessages = JSON.parse(JSON.stringify(defaultChannelMessages));
            saveMessagesToLocalStorage();
        }
    } else {
        // Initialize with empty messages on first visit
        channelMessages = JSON.parse(JSON.stringify(defaultChannelMessages));
        saveMessagesToLocalStorage();
    }
    
    // Check if channels exist in localStorage
    const savedChannels = localStorage.getItem('bridgingFuturesChannels');
    if (savedChannels) {
        try {
            const parsed = JSON.parse(savedChannels);
            // Merge with default channels to ensure core channels always exist
            channels = [...new Set([...channels, ...parsed])];
            saveChannelsToLocalStorage();
        } catch (e) {
            console.error('Error parsing saved channels:', e);
        }
    }
    
    // Load channel creators
    const savedCreators = localStorage.getItem('bridgingFuturesCreators');
    if (savedCreators) {
        try {
            Object.assign(channelCreators, JSON.parse(savedCreators));
        } catch (e) {
            console.error('Error parsing saved creators:', e);
        }
    }
    
    // Load channel descriptions
    const savedDescriptions = localStorage.getItem('bridgingFuturesDescriptions');
    if (savedDescriptions) {
        try {
            Object.assign(channelDescriptions, JSON.parse(savedDescriptions));
        } catch (e) {
            console.error('Error parsing saved descriptions:', e);
        }
    }
}

// Save messages to localStorage
function saveMessagesToLocalStorage() {
    try {
        localStorage.setItem('bridgingFuturesMessages', JSON.stringify(channelMessages));
    } catch (e) {
        console.error('Error saving messages to localStorage:', e);
        alert('Unable to save messages. Your browser may have limited storage.');
    }
}

// Save channels to localStorage
function saveChannelsToLocalStorage() {
    try {
        localStorage.setItem('bridgingFuturesChannels', JSON.stringify(channels));
    } catch (e) {
        console.error('Error saving channels to localStorage:', e);
    }
}

// Save creators to localStorage
function saveCreatorsToLocalStorage() {
    try {
        localStorage.setItem('bridgingFuturesCreators', JSON.stringify(channelCreators));
    } catch (e) {
        console.error('Error saving creators to localStorage:', e);
    }
}

// Save descriptions to localStorage
function saveDescriptionsToLocalStorage() {
    try {
        localStorage.setItem('bridgingFuturesDescriptions', JSON.stringify(channelDescriptions));
    } catch (e) {
        console.error('Error saving descriptions to localStorage:', e);
    }
}

// Render channels in the sidebar
function renderChannels() {
    const channelList = document.querySelector('.channel-list');
    if (!channelList) return;
    
    // Clear existing channels (except create button)
    const existingChannels = channelList.querySelectorAll('.channel');
    existingChannels.forEach(ch => ch.remove());
    
    // Add channels
    channels.forEach(channelName => {
        const channelDiv = document.createElement('div');
        channelDiv.className = 'channel';
        if (channelName === currentChannel) {
            channelDiv.classList.add('active');
        }
        
        const isUserCreated = channelCreators[channelName] === currentUserUsername;
        
        channelDiv.innerHTML = `
            <div class="channel-content">
                <span class="channel-icon">#</span>
                <span>${channelName}</span>
                ${isUserCreated ? '<span class="channel-creator-badge">✓ Moderator</span>' : ''}
            </div>
            ${isUserCreated ? '<button class="channel-delete-btn" onclick="deleteChannel(\'' + channelName + '\', event)" title="Delete channel">×</button>' : ''}
        `;
        
        channelDiv.onclick = (e) => {
            if (e.target.classList.contains('channel-delete-btn')) return;
            selectChannel(channelName);
        };
        
        channelList.appendChild(channelDiv);
    });
}

// Delete channel function
function deleteChannel(channelName, event) {
    event.stopPropagation();
    
    if (channelCreators[channelName] !== currentUserUsername) {
        alert('You can only delete channels you created.');
        return;
    }
    
    if (confirm(`Delete #${channelName}? This cannot be undone.`)) {
        // Remove channel
        channels = channels.filter(c => c !== channelName);
        delete channelMessages[channelName];
        delete channelCreators[channelName];
        delete channelDescriptions[channelName];
        
        // Save to localStorage
        saveChannelsToLocalStorage();
        saveMessagesToLocalStorage();
        saveCreatorsToLocalStorage();
        saveDescriptionsToLocalStorage();
        
        // Switch to general if deleted channel was active
        if (currentChannel === channelName) {
            currentChannel = 'general';
        }
        
        // Re-render
        renderChannels();
        loadChannelMessages();
    }
}

function initializeForum() {
    initializeLocalStorage();
    loadChannelMessages();
}

function selectChannel(channelName) {
    currentChannel = channelName;
    
    // Update active channel in sidebar
    const channelElements = document.querySelectorAll('.channel');
    channelElements.forEach(channel => {
        channel.classList.remove('active');
        if (channel.textContent.includes(channelName)) {
            channel.classList.add('active');
        }
    });
    
    // Update channel header
    const channelHeader = document.getElementById('currentChannel');
    if (channelHeader) {
        channelHeader.textContent = `# ${channelName}`;
    }
    
    // Load messages for this channel
    loadChannelMessages();
}

function loadChannelMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;
    
    const messages = channelMessages[currentChannel] || [];
    const description = channelDescriptions[currentChannel] || '';
    
    messagesContainer.innerHTML = '';
    
    // Add channel description at top
    if (description) {
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'channel-description';
        descriptionDiv.innerHTML = `<p>${description}</p>`;
        messagesContainer.appendChild(descriptionDiv);
    }
    
    if (messages.length === 0) {
        const emptyDiv = document.createElement('p');
        emptyDiv.style.cssText = 'text-align: center; color: #999; padding: 2rem;';
        emptyDiv.textContent = 'No messages yet. Be the first to say something!';
        messagesContainer.appendChild(emptyDiv);
    } else {
        messages.forEach(message => {
            const messageElement = createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });
    }
    
    // Scroll to bottom
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 0);
}

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const isCurrentUser = message.username === currentUserUsername;
    const messageClass = isCurrentUser ? 'own-message' : '';
    
    messageDiv.innerHTML = `
        <div class="message-header ${messageClass}">
            <strong>${message.username}</strong>
            ${isCurrentUser ? '<span class="user-badge">You</span>' : ''}
            <span class="timestamp">${message.timestamp}</span>
        </div>
        <div class="message-content">${message.content}</div>
        <div class="message-actions">
            <button class="reply-btn" onclick="replyToMessage('${message.username}')">Reply</button>
        </div>
    `;
    
    return messageDiv;
}

function replyToMessage(username) {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.focus();
        messageInput.value = `@${username} `;
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput || !messageInput.value.trim()) return;
    
    const messageContent = messageInput.value.trim();
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const timestamp = `Today at ${hours}:${minutes} ${ampm}`;
    
    const newMessage = {
        username: currentUserUsername,
        timestamp: timestamp,
        content: messageContent
    };
    
    // Add message to current channel
    if (!channelMessages[currentChannel]) {
        channelMessages[currentChannel] = [];
    }
    channelMessages[currentChannel].push(newMessage);
    
    // Save to localStorage IMMEDIATELY
    saveMessagesToLocalStorage();
    
    // Clear input
    messageInput.value = '';
    
    // Reload messages
    loadChannelMessages();
}

function handleMessageInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function createChannel() {
    const channelName = prompt('Enter channel name (lowercase, no spaces):');
    if (!channelName || channelName.trim() === '') return;
    
    const cleanChannelName = channelName.trim().toLowerCase().replace(/\s+/g, '-');
    
    if (channels.includes(cleanChannelName)) {
        alert('Channel already exists!');
        return;
    }
    
    const description = prompt('Enter channel description (what should people discuss here?):');
    
    // Add to channels array
    channels.push(cleanChannelName);
    
    // Mark as user-created with current user
    channelCreators[cleanChannelName] = currentUserUsername;
    
    // Initialize empty messages for new channel
    channelMessages[cleanChannelName] = [];
    
    // Set description
    channelDescriptions[cleanChannelName] = description || 'General discussion for this channel.';
    
    // Save to localStorage
    saveChannelsToLocalStorage();
    saveMessagesToLocalStorage();
    saveCreatorsToLocalStorage();
    saveDescriptionsToLocalStorage();
    
    // Re-render channels
    renderChannels();
    
    // Switch to new channel
    selectChannel(cleanChannelName);
}

// Smooth scrolling for better UX
function smoothScrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Timeline Navigation
function scrollToStep(stepId) {
    const element = document.getElementById(stepId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateTimeline(stepId);
    }
}

function updateTimeline(stepId) {
    document.querySelectorAll('.timeline-step').forEach(step => {
        step.classList.remove('active');
    });
    
    const stepNumber = stepId.match(/\d+/)?.[0];
    if (stepNumber) {
        const allSteps = document.querySelectorAll('.timeline-step');
        if (allSteps[stepNumber - 1]) {
            allSteps[stepNumber - 1].classList.add('active');
        }
    }
}

// Rent Affordability Calculator
function calculateAffordableRent() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    const expenses = parseFloat(document.getElementById('expenses').value) || 0;
    const resultDiv = document.getElementById('calculator-result');
    
    if (income <= 0) {
        resultDiv.innerHTML = '<p class="calc-error">Please enter your monthly income.</p>';
        return;
    }
    
    const disposableIncome = income - expenses;
    const maxRent = disposableIncome * 0.3;
    const minRent = Math.max(0, maxRent - 200);
    const maxRent2 = maxRent + 100;
    
    resultDiv.innerHTML = `
        <div class="calc-result-card">
            <div class="calc-result-item">
                <span class="calc-label">Max Affordable Rent</span>
                <span class="calc-value">$${maxRent.toFixed(0)}</span>
            </div>
            <div class="calc-result-item">
                <span class="calc-label">Safe Range</span>
                <span class="calc-value-range">$${minRent.toFixed(0)} - $${maxRent2.toFixed(0)}</span>
            </div>
            <p class="calc-note">This leaves room for utilities, savings, and unexpected costs.</p>
        </div>
    `;
}

// Download Checklists
function downloadChecklist(type) {
    const checklists = {
        'credit': {
            filename: 'Credit-Building-Checklist.txt',
            content: `CREDIT BUILDING CHECKLIST
==========================

MONTH 1-2: GET STARTED
☐ Check credit report at AnnualCreditReport.com
☐ Look for errors and dispute them
☐ Get free credit score from Credit Karma
☐ Open secured credit card (deposit $500-1000)
☐ Set up automatic payment reminder

MONTH 3-6: BUILD HABITS
☐ Keep credit utilization below 30%
☐ Pay at least minimum on time every month
☐ Check credit report quarterly
☐ Make at least one purchase per month on card
☐ Don't close any accounts

MONTH 6-12: SCALE UP
☐ Request credit limit increase
☐ Check if secured card upgraded to regular
☐ Consider second credit card (stagger applications)
☐ Maintain perfect payment history
☐ Monitor credit score trends

MONTH 12+: OPTIMIZE
☐ Expected score: 600-700
☐ Apply for better rewards card
☐ Use different cards strategically
☐ Keep all accounts open
☐ Continue perfect payment history

Expected Results:
- 6-12 months: Build from no credit to 600+ score
- 1-2 years: Reach 700+ score (good credit)
- 2+ years: Reach 750+ score (excellent credit)`
        },
        'loans': {
            filename: 'Loan-Repayment-Planner.txt',
            content: `STUDENT LOAN REPAYMENT PLANNER
===============================

BEFORE GRADUATION
☐ Log into StudentAid.gov
☐ List all federal loans with balances and interest rates
☐ List all private loans with rates
☐ Calculate total debt
☐ Understand servicer contact info
☐ Research income-driven repayment plans

INTEREST REDUCTION STRATEGY
☐ Start paying on unsubsidized loans while in school
☐ Even $25/month saves hundreds in interest
☐ Interest capitalization happens 6 months after graduation
☐ Pay interest before it capitalizes if possible

GRACE PERIOD (6 MONTHS POST-GRADUATION)
☐ No required payments on federal loans
☐ BUT interest still accrues on unsubsidized loans
☐ Optional: Make interest payments to reduce principal
☐ Choose repayment plan before grace ends

REPAYMENT PLAN COMPARISON
Standard 10-Year: $265/mo for $25k @ 5%
- Best for most entry-level jobs
- Lowest total interest

Income-Driven: ~10% of discretionary income
- Best if starting salary low ($30k)
- Can upgrade to Standard later

PAYMENT CHECKLIST
☐ Set up automatic payments (0.25% rate discount)
☐ Pay on time every month
☐ Monitor servicer communication
☐ Pay extra $50/month = save $3,000+ in interest
☐ Refinance private loans after 1 year if qualified

TIMELINE
Month 1: 10 years remaining
Month 6: 9.5 years remaining (paid $1,325 principal)
Month 60: 5 years remaining (paid $10,000+ principal)
Payoff: Completely debt-free!`
        },
        'prep-checklist': {
            filename: 'Renting-Prep-Checklist.txt',
            content: `FIRST-TIME RENTER PREP CHECKLIST
=================================

3 MONTHS BEFORE APARTMENT HUNT

BUDGET & FINANCES
☐ Calculate max rent (30% of gross income)
☐ Calculate total monthly cost (rent + utilities + insurance)
☐ Save for security deposit (1 month's rent)
☐ Save for move-in costs (2-3 months total)
☐ Check credit score (target 650+)
☐ Get co-signer parent if score under 620

DOCUMENTS TO GATHER
☐ Government-issued ID
☐ Job offer letter or recent paystubs (2-3 months)
☐ Bank statements (shows savings)
☐ References (supervisor, previous landlord, professor)
☐ Write brief renter's resume

CREDIT CHECK
☐ Review credit report (AnnualCreditReport.com)
☐ Dispute any errors
☐ Pay down any credit card debt (lower utilization)
☐ Make sure all recent payments show as on-time
☐ Don't open new credit cards before applying`
        },
        'search-guide': {
            filename: 'Smart-Apartment-Search-Guide.txt',
            content: `SMART APARTMENT SEARCH GUIDE
=============================

BEST WEBSITES FOR FIRST-TIMERS
☐ Apartments.com - Largest selection, verified landlords
☐ Zillow - Detailed info, ratings, neighborhood data
☐ Rent.com - Landlord verification, cash-back rewards
☐ PadMapper - Map view, transit overlays
☐ Craigslist - Direct from owners BUT CHECK FOR SCAMS

RESEARCH THE AREA
☐ Crime rates: NeighborhoodScout.com
☐ Commute time: Google Maps (check rush hour)
☐ Walkability: WalkScore.com
☐ Visit neighborhood at different times
☐ Check reviews online (Google, Apartment.com)

TIMELINE FOR SUCCESS
☐ Start search 6-8 weeks before move date
☐ Most apartments rent in 2-3 weeks
☐ Early searching = more options + negotiating power
☐ Visit 3-5 apartments minimum
☐ Take photos/videos during tours

RED FLAGS WHILE SEARCHING
☐ Pressure to decide immediately
☐ Requests for wire transfer before seeing in person
☐ "Can't verify landlord" on Craigslist
☐ Cash-only deposits/payments
☐ Prices unrealistically low for area`
        },
        'tour-checklist': {
            filename: 'Apartment-Tour-Inspection-Sheet.txt',
            content: `APARTMENT TOUR INSPECTION SHEET
=================================

UNIT CONDITION
☐ Check water pressure (all faucets)
☐ Turn on stove - does it work?
☐ Open all closets - adequate storage?
☐ Look for mold, stains, damage
☐ Test lights and outlets
☐ Check window locks and seals
☐ Look for cracks in walls/ceiling
☐ Turn on heat/AC - does it work?
☐ Check for smoke detectors/carbon monoxide detectors

PLUMBING & WATER
☐ No leaks under sinks
☐ Water drains properly
☐ Hot water heater: ask about temperature/capacity
☐ Toilet flushes properly
☐ No rust in pipes visible

APPLIANCES
☐ Refrigerator: Works and clean?
☐ Stove/oven: All burners work?
☐ Dishwasher (if included): runs?
☐ Microwave: works?
☐ Washer/dryer: included or hookup available?
☐ Who replaces if broken during lease?

QUESTIONS TO ASK
☐ What utilities are included?
☐ Average electric/water bill for this unit?
☐ Maintenance response time for repairs?
☐ Any upcoming maintenance or rent increases?
☐ Can you see the lease before applying?
☐ Subletting policy?
☐ Pet policy (if applicable)?

TAKE PHOTOS/VIDEO
☐ Photo date/time stamp
☐ Wide shots of each room
☐ Close-ups of any damage
☐ Video walkthrough
☐ Save for reference`
        },
        'lease-review': {
            filename: 'Lease-Red-Flags-Checklist.txt',
            content: `LEASE RED FLAGS CHECKLIST
=========================

BEFORE SIGNING, VERIFY
☐ Lease term (12 months typical)
☐ Move-in costs breakdown
☐ Rent increase language (3-5% typical)
☐ Maintenance response time
☐ Entry notice requirement (24-48 hours typical)
☐ Subletting/roommate policy
☐ Pet policy (if applicable)
☐ Early termination fees
☐ Security deposit terms

GOOD LEASE SIGNS
☐ All terms in writing, nothing blank
☐ Clear clause on who fixes what
☐ Specific maintenance response times
☐ Deposit returned within 30-45 days
☐ Professional, responsive landlord
☐ Reasonable early termination fee (2-4 weeks rent max)

RED FLAGS - DO NOT SIGN
☐ Blank spaces in lease
☐ Conflicting terms from tour conversation
☐ Landlord won't provide lease before application
☐ Early termination fee over 2 months rent
☐ Landlord won't give copy to keep
☐ Pressure to decide before you're ready
☐ Cash-only payments required
☐ No itemized move-in cost breakdown

NEGOTIATION POINTS
☐ Request waive $500 admin fee
☐ Negotiate rent down 5-10%
☐ Ask about first month utilities included
☐ Reduce security deposit if perfect credit
☐ Request specific move-in date

BEFORE SIGNING
☐ Read entire lease 2-3 times
☐ Ask questions about unclear terms
☐ Get everything in writing
☐ Keep copy for yourself
☐ Take photos of lease terms`
        },
        'move-in-guide': {
            filename: 'Move-In-Day-Checklist.txt',
            content: `MOVE-IN DAY CHECKLIST
====================

ARRIVAL DAY
☐ Take photos/videos of EVERY room BEFORE moving anything
☐ Document existing damage with date/time stamp
☐ Close-ups of stains, damage, broken items
☐ Wide shots of each room
☐ Save all photos/videos

WALKTHROUGH WITH LANDLORD
☐ Landlord walks through with you
☐ Show any pre-existing damage
☐ Fill out move-in inspection form together
☐ Both sign move-in inspection form
☐ Request written confirmation of deposit received
☐ Get copy for your records

DOCUMENT EVERYTHING
☐ Deposit receipt with amount and date
☐ Landlord contact information
☐ Emergency contact procedures
☐ Maintenance request process (email/phone/portal?)
☐ Maintenance emergency number
☐ Building rules and policies

UTILITIES & SERVICES
☐ Know how to control heat/AC
☐ Find circuit breaker location
☐ Know water shutoff location
☐ Set up renters insurance (~$15/month)
☐ Register utilities in your name
☐ Know how to pay rent (online, check, ACH?)

FIRST WEEK TASKS
☐ Submit any maintenance requests for damages
☐ Document with photos
☐ Keep copies of all communications
☐ Set up automatic rent payment
☐ Create file with all lease documents
☐ Take meter readings (electric, water) if applicable

IF SOMETHING IS BROKEN ON DAY 1
☐ Submit maintenance request immediately in writing (email)
☐ Reference move-in photos as proof it was pre-existing
☐ Don't attempt repairs yourself
☐ Follow up in writing if not fixed within stated timeframe`
        },
        'renters-rights': {
            filename: 'First-Timer-Renters-Rights-Guide.txt',
            content: `FIRST-TIME RENTER'S RIGHTS GUIDE
================================

YOUR 6 ESSENTIAL RIGHTS

1. RIGHT TO HABITABILITY
Landlord MUST provide:
☐ Safe structure (no holes, roof leaks)
☐ Working heat/AC (65-68°F winter typical)
☐ Hot/cold water
☐ Electricity
☐ No pests or mold

If landlord refuses repairs:
☐ Send written request (email works)
☐ After 14-30 days, you can:
  - Pay to repair and deduct from rent
  - Request rent reduction
  - Break lease without penalty
☐ Contact local legal aid for guidance

2. RIGHT TO PRIVACY
☐ Landlord must give 24-48 hours notice before entry
☐ Exceptions: Fire, gas leak, flooding (emergencies)
☐ No random inspections
☐ No landlord showing apartment without notice
☐ Illegal entry = grounds to break lease

3. SECURITY DEPOSIT PROTECTION
☐ Deposit held in escrow (separate account)
☐ Returned within 30-45 days (check your state)
☐ With itemized deductions for ACTUAL damage only
☐ Landlord must provide receipts for deductions
☐ Normal wear-and-tear is NOT deductible
☐ Landlord can't keep deposit for future damage

4. MAINTENANCE & REPAIR RIGHTS
☐ Major repairs = landlord's responsibility
☐ Landlord must respond within 24-48 hours
☐ Normal wear-and-tear is NOT your fault
☐ Appliance failure after years = not your fault
☐ Paint fade from sun = not your fault
☐ Small nail holes = not your fault

5. PROTECTION FROM RETALIATION
Landlord CANNOT evict you for:
☐ Requesting repairs
☐ Reporting code violations
☐ Complaining to housing authority
☐ Organizing with other tenants
☐ Most states have 30-90 day retaliation protection

6. FAIR HOUSING RIGHTS
Landlord CANNOT discriminate based on:
☐ Race, color, national origin
☐ Religion
☐ Family status (kids, pregnancy)
☐ Disability (physical or mental)
☐ Sexual orientation (some states)
☐ Source of income

WHAT'S NORMAL WEAR & TEAR (YOU DON'T PAY)
☐ Carpet worn from walking
☐ Paint faded from sunlight
☐ Minor stains from normal living
☐ Small nail holes (picture hanging)
☐ Appliance failure after years of use
☐ Discolored grout from age
☐ Loose hinges from normal use

DAMAGE YOU WOULD PAY FOR
☐ Holes in walls from moving furniture
☐ Broken windows (unless structural defect)
☐ Broken appliances from abuse
☐ Deep pet stains/damage (beyond normal)
☐ Broken locks (unless landlord installed it)
☐ Carpet damage beyond normal wear
☐ Graffiti or vandalism

IF LANDLORD TRIES ILLEGAL EVICTION
Do NOT let them:
☐ Remove your belongings
☐ Change locks while you're renting
☐ Shut off utilities
☐ Remove doors/windows
☐ Harass you to move

Actions to take:
☐ Contact local police (illegal eviction = crime)
☐ Call legal aid immediately
☐ Document everything with photos/video
☐ Save all communication

RESOURCES FOR HELP
☐ Local tenant unions/organizations
☐ Legal aid services (legal-aid.org)
☐ State attorney general's office
☐ HUD (housing.gov) - fair housing complaints
☐ Consumer Financial Protection Bureau (consumerfinance.gov/renters) - renters`
        },
        'application-checklist': {
            filename: 'Application-Checklist.txt',
            content: `FIRST-TIME RENTER APPLICATION CHECKLIST
=========================================

DOCUMENTS TO PREPARE (Gather 2-3 weeks before applying)
☐ Government-issued ID (driver's license or passport)
☐ Social Security Number (for background check)
☐ Proof of income: 2 recent paystubs or job offer letter
☐ Bank statements: 2-3 months showing steady deposits
☐ Employment verification: Supervisor contact info
☐ References: Previous landlord, personal references
☐ Credit report: Free from AnnualCreditReport.com

APPLICATION PROCESS
☐ Research 3-5 apartments that fit your budget
☐ Read reviews on ApartmentRatings.com or Yelp
☐ Call to confirm availability and ask about specials
☐ Apply online or in-person (online is faster)
☐ Pay application fee ($25-50) - non-refundable
☐ Follow up after 3 days if no response

AFTER APPLICATION APPROVED
☐ Review lease terms carefully (don't rush)
☐ Ask questions about anything unclear
☐ Negotiate if possible (first-time specials)
☐ Get everything in writing
☐ Keep copies of all documents

TIMELINE EXPECTATIONS
Day 1-3: Application submitted
Day 3-7: Approval decision (background/credit check)
Day 7-14: Lease signing and move-in date set
Week 2-4: Move-in day

COMMON APPLICATION QUESTIONS
Q: What if I have no rental history?
A: Get a landlord reference from family/friends, or offer higher deposit

Q: What if my credit score is low?
A: Explain circumstances, offer co-signer, or higher security deposit

Q: Can I apply with pending job offer?
A: Some landlords accept it - ask upfront

RED FLAGS TO AVOID
☐ Applications that require cash payments
☐ No written lease agreement
☐ Pressure to sign immediately
☐ Hidden fees not disclosed upfront
☐ Landlord won't provide references`
        },
        
        'leasing-all': {
            filename: 'Complete-First-Time-Renter-Guide.txt',
            content: `COMPLETE FIRST-TIME RENTER'S GUIDE
===================================

This comprehensive guide covers everything you need to know about renting your first apartment. Follow the 6-step process and use the checklists to stay organized.

STEP 1: FINANCIAL PREPARATION (2-3 MONTHS BEFORE)
Budget Rule: Rent ≤ 30% of take-home pay
Example: $3,000 income = max $900 rent

Save for:
- Security deposit (1 month's rent)
- First month's rent
- Application fees ($25-50)
- Moving costs ($500-1,000)
- Renters insurance ($10-20/month)

Credit Score Target: 650+ (check free at CreditKarma.com)
Documents Needed: ID, paystubs, bank statements, references

STEP 2: APARTMENT SEARCH (6-8 WEEKS BEFORE)
Best Websites:
- Apartments.com (virtual tours, verified landlords)
- Zillow (neighborhood data, rent estimates)
- Rent.com (cash-back rewards)
- PadMapper (transit overlays)
- Craigslist (direct owner deals - high scam risk)

Research Tools:
- Crime rates: CrimeGrade.org
- Commute: Google Maps
- Walkability: WalkScore.com
- Reviews: Yelp, Google, ApartmentRatings.com

Lease Types:
- Month-to-Month: Flexible but expensive
- 6-Month: Lower rent, renewal hassle
- 12-Month: Best rates, commitment required

STEP 3: PROPERTY TOURS (4-6 WEEKS BEFORE)
What to Inspect:
- Plumbing: Test faucets, check for leaks
- Appliances: Stove, fridge, dishwasher
- HVAC: Test heat/AC, check vents
- Structure: Cracks, stains, mold
- Security: Locks, windows, emergency exits
- Storage: Closets, basement access

Questions to Ask:
- What's included in rent?
- Average utility bills?
- Maintenance response time?
- Pet policy and deposits?
- Subletting allowed?

Red Flags:
- Landlord avoids lease questions
- Cash-only payments required
- Pressure to sign immediately
- Poor maintenance in common areas

STEP 4: APPLICATION PROCESS (2-3 WEEKS BEFORE)
Required Documents:
- Government ID
- Proof of income (paystubs/job offer)
- Bank statements (2-3 months)
- References (employer, landlord)
- Credit report

Application Tips:
- Apply to multiple places
- Be honest about everything
- Follow up after 3-5 days
- Ask about first-time renter specials

Approval Timeline: 3-7 business days

STEP 5: LEASE REVIEW & SIGNING (1-2 WEEKS BEFORE)
Key Clauses to Check:
- Rent amount and due dates
- Lease term length
- Security deposit terms
- Pet policies
- Termination conditions
- Maintenance responsibilities

Negotiation Points:
- Waive admin fees
- Reduce rent slightly
- Include first month utilities
- Lower security deposit if perfect credit
- Request specific move-in date

Don't Sign If:
- Terms are unclear
- You can't afford it
- Early termination fees are excessive
- No copies provided

STEP 6: MOVE-IN & SETUP (MOVE-IN DAY)
Move-In Inspection:
- Take 20+ photos of every room
- Document existing damage
- Get landlord signature on checklist
- Note utility meter readings

Setup Tasks:
- Change locks if needed
- Get emergency contacts
- Set up utilities
- Submit renters insurance proof

First Week Tasks:
- Report any issues in writing
- Meet neighbors
- Update address everywhere
- Find local amenities

RENTER'S RIGHTS ESSENTIALS
Your 6 Basic Rights:
1. Habitability - Safe, working home
2. Privacy - 24-48 hour entry notice
3. Deposit Protection - Returned with receipts
4. Repair Rights - Landlord handles major fixes
5. Anti-Retaliation - Can't evict for complaints
6. Fair Housing - No discrimination

Normal Wear & Tear (You Don't Pay):
- Worn carpet from walking
- Faded paint from sunlight
- Small nail holes
- Appliance failure after years

Damage You Pay For:
- Holes in walls
- Broken windows
- Pet damage
- Vandalism

If Landlord Ignores Repairs:
1. Send written request
2. Document with photos
3. After 14-30 days, repair and deduct
4. Contact legal aid

Illegal Eviction Tactics:
- Removing belongings
- Changing locks
- Shutting off utilities
- Harassment

RESOURCES FOR HELP
- Legal Aid: legal-aid.org (free if low income)
- HUD: housing.gov (fair housing complaints)
- State attorney general's office

FINAL TIPS FOR FIRST-TIMERS
- Start the process early (2-3 months out)
- Get everything in writing
- Trust your instincts - if it feels wrong, walk away
- Join local tenant groups for support
- Keep records of all communications
- Know your state's specific tenant laws

Remember: Renting is a big responsibility, but millions do it successfully every year. Take it one step at a time, and you'll be fine!`
        }
    };
    
    const checklist = checklists[type];
    if (checklist) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(checklist.content));
        element.setAttribute('download', checklist.filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

// Add some interactive elements for better engagement
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add fade-in animation for content cards when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe content cards
    const contentCards = document.querySelectorAll('.content-card');
    contentCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});