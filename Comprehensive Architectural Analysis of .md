Comprehensive Architectural Analysis of MasterStudy LMS Business Logic for React and Django Implementation

1. Executive Summary and Architectural Vision
   This report presents an exhaustive technical and functional analysis of the MasterStudy Learning Management System (LMS) business logic. It is designed to serve as the foundational reference architecture for a custom implementation utilizing a React frontend and a Django backend. The analysis deconstructs the platform’s operations into constituent logic blocks, state machines, data relationships, and user interaction flows, focusing specifically on the high-complexity areas of teacher-student operations, assessment engines, curriculum delivery, and monetization strategies found in the Pro versions.
   MasterStudy LMS operates as a monolithic WordPress plugin, yet its functional decomposition reveals a distributed application architecture. In its native state, it utilizes Vue.js and React-based components for dynamic interfaces (such as the Course Player and Quiz Builder) while relying on PHP/MySQL for data persistence and server-side logic.1 For a decoupled Django/React implementation, this architecture necessitates a design where Django manages the relational data modeling, complex state transitions, and permission gating, while React manages the asynchronous consumption of learning content and real-time state updates.
   The core value proposition of the MasterStudy architecture lies in its hybrid content delivery model, which supports both linear (sequential) and non-linear (menu-driven) learning paths, overlaid with a complex access control layer that manages memberships, one-time purchases, and trial access simultaneously. This report will systematically dissect these mechanisms to provide a blueprint for replication.
2. Core Entity Relationships and Data Modeling
   To replicate the business logic effectively, one must first understand the fundamental data models that drive the system. The MasterStudy architecture revolves around a specific set of primary entities that interact through complex polymorphic relationships.
   2.1 The Course Object: The Central Aggregator
   The Course entity is the root parent object in the LMS hierarchy. It acts not merely as a container for content but as the central node for pricing rules, access logic, and metadata. Unlike simple content management systems where a "page" is a static entity, a MasterStudy Course is a dynamic object with fluctuating states based on user interaction.
   Logic & Data Implications:
   Polymorphic Content Association: A Course does not directly contain content; it aggregates "Curriculum Items." These items can be Lessons (text, video, stream), Quizzes, or Assignments.3 In a Django model, this suggests a CurriculumItem model that uses a GenericForeignKey to link to specific content type tables, or a base Item class with subclassing.
   Categorization & Leveling: Courses are strictly typed by Category and Difficulty Level (Beginner, Intermediate, Advanced). This metadata is crucial for the filtering logic on the course archive page.5
   State Management: The course exists in multiple states: Draft, Pending Review, Published, and Rejected. This implies a finite state machine that governs visibility. Only Published courses are accessible via the public API, while Draft and Pending states are restricted to the Instructor and Admin dashboards respectively.6
   2.2 The Curriculum Entity and Sectioning Logic
   The curriculum is structured hierarchically. The logic dictates a parent-child relationship where a Course contains multiple Sections, and Sections contain multiple Items.
   Hierarchy Level
   Entity
   Responsibilities
   Django Logic Implication
   Level 1
   Section
   Logical grouping of content (e.g., "Week 1", "Module A"). Holds title and order_index.
   Foreign Key to Course. Ordering field is mandatory.
   Level 2
   Item
   The actual learning unit. Can be a Lesson, Quiz, or Assignment. Holds title, duration, preview_flag.
   Many-to-Many with Section (to allow reuse) or One-to-Many.
   Level 3
   Materials
   downloadable assets attached to items.
   FileField linked to Item.

Reuse Logic: A critical feature of MasterStudy is the ability to search for and reuse existing lessons and quizzes across different courses.7 This explicitly confirms that the relationship between Courses and Curriculum Items is Many-to-Many. A single quiz on "Safety Basics" can exist in "Construction 101" and "Lab Safety 200". In Django, this requires a Through model (e.g., CourseCurriculum) to store the specific order_index and section_id for that specific course context, ensuring that reordering the quiz in Course A does not affect its position in Course B.
2.3 User Roles and Access Control Layer
The system distinguishes between four primary roles, each with distinct permission scopes.
Guest (Public): Restricted to viewing Course Archive and Single Course Landing Pages (Title, Description, Curriculum Outline, Instructor Bio). Can access lessons flagged as "Trial" or "Preview".8
Student: Authenticated users who hold an Enrollment record. They can access full content, view the Student Dashboard, track progress, and submit assessments.
Instructor: Can create courses, manage their own students, view earnings, and configure payout settings. They have write access to the Course and Lesson tables but are restricted to their own records.5
Co-Instructor: A specialized role allowing shared management. The logic dictates that Co-Instructors can manage students and discussions but are strictly restricted from editing the course structure or deleting content unless they are the primary author.9 This requires a granular permission system in Django (e.g., django-guardian or custom decorators) to check object.owner == request.user. 3. Course Management Subsystem (The Builder)
The Course Management subsystem is the operational heart for instructors. MasterStudy employs a unified logic for course creation, accessible via two interfaces: the WordPress Backend and a Frontend Instructor Dashboard.
3.1 Course Builder Logic
The "Course Builder" is a sophisticated UI component that facilitates the drag-and-drop construction of the curriculum. For a React implementation, this requires a complex state management solution (like Redux or Zustand) to handle the nested array manipulation of Sections and Items before persistence.
Functional Workflow & Logic:
Initialization: The instructor creates a course shell. Essential metadata is required: Title, Category, and Featured Image.
Curriculum Construction:
Section Creation: Instructors create sections as buckets.
Item Injection: Instructors can create new lessons on the fly or search the database for existing lessons.5
Drag-and-Drop Ordering: The UI must support reordering items within a section and moving items between sections.
Configuration Tabs:
General: Description, announcements.
Pricing: Setting One-time price, Sale price, or Points price.10
Drip Content: Configuring release schedules.
Prerequisites: Selecting required courses.
FAQ: Adding course-specific Q&A pairs.
Technical Implication: The "Save" action in the builder is likely a bulk update operation. The API payload would need to send the entire curriculum structure (nested JSON) to the backend, where Django would process the tree, update the order fields, and create/link the necessary CurriculumItem records.
3.2 Drip Content Logic
Drip content controls the temporal release of lessons, a critical feature for keeping students engaged and preventing content binging. MasterStudy implements two distinct logical branches for this, which are mutually exclusive in some configurations.11
3.2.1 Sequential Logic (Dependency-Based)
This is a "unlock-on-completion" model.
Global Lock: A system-wide setting "Sequential Lesson Lock" forces a strict linear progression (). Lesson remains locked until Lesson sends a valid completion event.
Local Override: Even if the global lock is off, an instructor can enable "Lock Lessons in Order" for a specific course.
Custom Dependency: In the absence of linear locking, instructors can manually define dependencies (e.g., "Lesson C requires Lesson A").
Visual Logic: Locked items appear in the curriculum with a padlock icon. Clicking them triggers a restriction notification.
3.2.2 Scheduled Logic (Time-Based)
This release strategy relies on the enrollment_date or absolute timestamps.
Relative Scheduling (X Days After Enrollment): Release_Date = Enrollment_Date + X_Days. This requires a background job (Celery in Django) or a real-time check at the moment of access request.
Absolute Scheduling (Specific Date/Time): Release_Date = YYYY-MM-DD HH:MM. Useful for webinars or semester-based courses.
Logic Conflict Handling: If a lesson is scheduled for release in the future, it acts as a hard blocker in a sequential chain. Even if the student completes the previous lesson, the time-lock takes precedence, effectively pausing the sequence.
3.3 Prerequisites and Access Restrictions
Beyond internal lesson locking, entire courses can have prerequisites.
Business Logic: A student cannot enroll in Course_B until Course_A is marked completed.
Implementation: The enrollment controller checks the User_Course_Progress table for Course_A. If status!= completed, the "Buy Now" button for Course_B is disabled or replaced with a "Prerequisite Required: [Course Name]" notice.13
Data Structure: This implies a ManyToManyField on the Course model to itself (symmetrical=False), storing the required predecessors.
3.4 Trial and Preview Logic
To drive conversions, MasterStudy allows specific lessons to be marked as "Trial" or "Preview".8
Public Access: These lessons are accessible to Guest users (unauthenticated) or strictly logged-in free users, depending on the "Guest Checkout" setting.
Conversion Funnel:
User views Course Landing Page.
User clicks "Preview" on Lesson 1.
Player loads content without enrollment check.
Upon completion, the "Next Lesson" logic detects the next item is not a preview.
Trigger: System displays a "Pay Wall" modal or redirects to the Checkout page to unlock the rest of the curriculum. 4. Content Delivery Engine (The Player)
The "Course Player" is the primary consumption interface. In a React/Django build, this is a distinct Single Page Application (SPA) responsible for rendering content, tracking state, and communicating progress.
4.1 Lesson Types and Rendering Logic
The system must handle polymorphism in lesson types, each with unique rendering and completion logic.3
4.1.1 Text Lesson
Content: HTML/Rich Text.
Completion Logic: Manual. The student must explicitly click a "Complete" button.
Timer: Optional "Minimum Read Time" enforcement before the button becomes active.
4.1.2 Video Lesson
Sources: YouTube, Vimeo, Presto Player, Self-hosted MP4, External Link.14
Privacy Logic: The system strips YouTube branding and hides direct links to prevent off-platform viewing.10
Automated Progress Logic:
The player tracks the timeupdate event.
Requirement: If Required Video Progress is set (e.g., 90%), the React frontend monitors playback.
Trigger: When currentTime >= duration _ 0.90, an API call POST /api/lesson/complete is fired automatically.
State Persistence: The player remembers the last playback position, requiring a last_viewed_timestamp field in the database.
4.1.3 Stream / Zoom / Google Meet
Integration: Relies on external API connections.
Logic: The lesson renders a "Join Meeting" button.
Access Control: The button is only clickable if Current_Time >= Meeting_Start_Time - Buffer (e.g., 15 mins).
Completion: Typically manual, or triggered if the user clicks the link (proof of attendance is harder to verify via API without deep integration).
4.1.4 Slides / PDF
Rendering: Uses PDF.js or similar libraries to embed the document.
Completion: Manual "Complete" button or "Scroll to Bottom" detection.
4.2 Progress Tracking and State Persistence
The system maintains a normalized progress record for every user-course pair.
Progress Calculation: .
Database Triggers:
When a lesson is completed, the backend updates the UserLessonProgress table.
It then recalculates the parent UserCourseProgress.
Completion Event: If Course Progress == 100%, the system triggers the Course_Completed event, which initiates Certificate generation and Email notifications.15
Reset Logic: Admins can manually reset progress via the "Manage Students" dashboard. This action deletes the UserLessonProgress rows and resets the aggregate percentage to zero.16 5. Assessment Engine: Quizzes and Assignments
The assessment logic in MasterStudy is robust, supporting both automated (Quiz) and manual (Assignment) grading workflows. This is the most technically complex part of the backend logic.
5.1 Quiz Architecture and Logic
The Quiz entity acts as a container for Questions. Crucially, MasterStudy utilizes a Question Bank architecture.
Relationship: Questions are stored in a central pool and linked to quizzes via a Many-to-Many relationship. This allows a single "Safety Protocol" question to appear in multiple quizzes across different courses.7
Question Types & Validation Logic:
Single Choice: Radio button logic. Validates against one correct ID.
Multiple Choice: Checkbox logic. Validates against a set of correct IDs.
True/False: Boolean validation.
Item Match: Key-Value pair validation. User must correctly map Item A to Definition B.
Image Match: Visual variant of Item Match.
Fill in the Gap: String matching. Requires logic to handle case sensitivity and whitespace trimming.
Keywords: Checks if the user's input contains specific required tokens.
Ordering: Validates the sequence of IDs (e.g., Step 1, Step 2, Step 3).17
5.1.1 Quiz Execution State Machine
Initialization: The user starts the quiz. The system captures start_time.
Timer Logic: If duration > 0, the server calculates end_time = start_time + duration. The frontend syncs a countdown. If the timer expires, the quiz auto-submits.
Attempt Tracking: The system checks User_Attempts count.
Logic: If Current_Attempts >= Max_Attempts, access is denied.
Submission & Grading:
User answers are POSTed to the backend.
Score Calculation: . Note: MasterStudy generally uses binary grading (correct/incorrect) per question unless partial credit is explicitly configured.
Result Determination: If , Status = Passed. Else, Failed.
Review Logic: If Show Correct Answer is enabled, the student can review their submission against the key after completion. This view is strictly gated to completed attempts.18
5.1.2 Grading Modifiers (Retake Logic)
To discourage brute-forcing, MasterStudy supports points deduction on retakes.
Logic: Final_Score = Raw_Score _ (1 - (Retake_Count \* Penalty_Percent)).
Example: Retake 1 max score = 85%. Retake 2 max score = 70%.
5.2 Assignment Workflow (Manual Grading)
Assignments represent open-ended assessments requiring instructor intervention.
State Machine:
Draft: Student works on the assignment. Can upload files or save text drafts.
Submitted: Student clicks "Submit". Status changes to Pending Review. Content is locked from editing.
Under Review: Instructor views the submission in the "Assignments" dashboard.
Validation: Instructor checks file constraints (size, extension).19
Graded: Instructor assigns a score (0-100) and optional feedback.
Decision: Instructor marks as Passed or Failed.
Re-submission (Conditional): If Failed and Attempts_Remaining > 0, the student can edit and resubmit, resetting the state to Submitted.
5.3 Gradebook and Aggregation
The Gradebook provides the high-level academic view.
Calculation Logic: .
Weighting Note: MasterStudy natively uses a Simple Average (Equal Weighting) logic. It does not support complex weighted categories (e.g., "Quizzes 30%, Exams 70%") out of the box.20
Design Recommendation: For a Django implementation, creating a GradeWeight model linked to Course or Section would be a significant enhancement.
Regeneration: Since grades are calculated aggregately, a "Regenerate" function is available to re-compute averages if an instructor modifies a past assignment's score. 6. User Operations and Dashboards
The user experience is bifurcated into distinct dashboards for Students and Instructors, each with specific data visibility rules.
6.1 Instructor Operations
6.1.1 Registration and Verification
Workflow: User fills "Become an Instructor" form -> Status Pending -> Admin Review -> Status Approved.
Role Switch: Upon approval, the user's role capability is_instructor is set to True. This grants access to the Course Builder and Instructor Dashboard.21
6.1.2 Instructor Dashboard
This is a private, authenticated area.
My Courses: List of courses owned by the user. Includes "Pending" courses waiting for Admin approval.
Student Management:
Scope Restriction: Instructors can only view data for students enrolled in their courses.
Actions: The instructor can reset a student's progress (nuke the User_Course_Progress record) or mark a specific lesson as complete. This manual override is essential for handling technical glitches or offline completion.16
Earnings & Payouts:
Commission Logic: .
Payout Flow: Request Withdrawal -> Admin Notification -> Admin Processing (PayPal/Stripe) -> Status Paid.22
6.2 Student Operations
6.2.1 Student Dashboard
Enrolled Courses: Displays active courses with visual progress bars.
My Certificates: A digital wallet of earned certificates.
Order History: Invoices and payment status.
Membership Status: If applicable, shows active plans and expiration dates.
6.2.2 Communication (Q&A)
Contextual Messaging: MasterStudy implements a Q&A system linked to specific lessons.
Notification Logic: When Student A posts a question on "Lesson 5", the Instructor receives a notification linking specifically to that lesson context.
Visibility: Discussions can be public (forum-style) or private (direct messaging), configured at the course level.23 7. Monetization and Commerce Architecture
MasterStudy supports a dual-engine commerce architecture: Native and WooCommerce. For a Django build, replicating the logic of these engines requires handling multiple transaction types.
7.1 Purchase Models
One-Time Purchase:
Logic: Standard e-commerce. User pays Price. Enrollment record created with access_type='lifetime' (or limited if expiration is set).
Memberships (via Integration):
Logic: This relies on role-based access. A user buys a "Gold Membership". The system maps "Gold Membership" to a specific set of Course Categories.
Access Check Middleware: When a user attempts to access a course, the system checks:
Do they own the course directly? (Yes -> Allow).
Do they have an active Membership? (Yes).
Does the Membership cover this Course's Category? (Yes -> Allow).
Priority: Membership access overrides the individual price check.24
Course Bundles:
Entity: A Bundle is a product that contains a list of Course_IDs.
Enrollment Logic: Purchasing a bundle triggers a loop that creates Enrollment records for all child courses simultaneously.
Restriction: Typically, courses in a bundle must belong to the same instructor to simplify commission calculations, or the system must support split payments.25
7.2 Enterprise Group Courses
This features supports B2B sales (selling to organizations).
Group Admin: A single user purchases N seats.
Seat Management: The Group Admin invites users via email.
Access Inheritance: Invited users do not "own" the course financially. Their access is derivative of the Group Admin's purchase.
Revocation Logic: If the Group Admin removes a user from the group, the system must immediately revoke that user's access to the course content.26
7.3 Points System (Gamification & Currency)
MasterStudy includes a virtual currency system that functions as both a reward and a payment method.
Earning Logic: Defined in Points Distribution settings. Users earn points for events: User_Registered, Course_Completed, Quiz_Passed.
Spending Logic: Courses have a secondary price field: point_price.
Transaction: If User_Wallet >= Course_Point_Price, the points are deducted, and enrollment is granted.
Affiliate Logic: Users generate unique referral links. If a new user registers via Link X, the owner of Link X receives points based on the Affiliate Points Percent setting.27 8. Gamification and Engagement Logic
8.1 Certificate Generation Engine
Trigger: The Course_Completed event.
Validation: Is Course_Progress == 100%? If Certificate Threshold is set, did the user achieve the minimum score on the final quiz?
Rendering: The system generates a PDF based on a visual template designed in the Certificate Builder. Dynamic fields ({student_name}, {date}) are injected at render time.
Verification API:
Unique ID: Every certificate is assigned a UUID.
Public Endpoint: GET /api/certificate/verify/{uuid}.
QR Code: The certificate includes a QR code encoding the verification URL. Scanning it validates the authenticity of the document.28
8.2 Email Manager (Notification Bus)
MasterStudy uses an event-driven notification system.
Triggers: User_Registered, Course_Enrolled, Lesson_Completed, Quiz_Passed, Assignment_Submitted.
Templating: Administrators can customize email templates using shortcodes.
Logic: When Event X occurs, the Notification Bus looks up the template, resolves the shortcodes, and dispatches the email via SMTP.29 9. Technical Implementation Recommendations (React & Django)
Based on the analysis of MasterStudy LMS, the following architectural decisions are recommended for the custom build to faithfully replicate and improve upon the logic.
9.1 Backend (Django) Architecture
Polymorphic Models: Use django-polymorphic for the CurriculumItem model to handle the diversity of Lessons, Quizzes, and Assignments while maintaining a single queryable table for the syllabus.
Service Layer for Access Control: Do not embed access logic in Views. Create a CourseAccessService that validates all rules (Enrollment, Membership, Drip, Prerequisite, Group Access) in a single, reusable method can_access_content(user, item).
Celery for Drip/Notifications: Scheduled drip content and email notifications should be offloaded to Celery workers to prevent request blocking.
Signal-Based Architecture: Replicate WordPress hooks using Django Signals.
signal_course_completed -> triggers Certificate Generation.
signal_quiz_passed -> triggers Point Awarding.
9.2 Frontend (React) Architecture
Global Player State: Use a robust state manager (Redux Toolkit or Zustand) for the Course Player. It must track current_lesson, next_lesson, is_sidebar_open, and progress_percent globally.
Optimistic UI: When a user clicks "Complete", update the UI immediately (turn the checkmark green) while the API request processes in the background. If the request fails, rollback the state and show an error.
Video Wrappers: Create custom React hooks (useVideoProgress) that wrap native <video> or YouTube/Vimeo players. This hook should normalize the timeupdate events from different providers to drive the "Required Progress" logic consistently.
Real-Time Sync: For Quizzes, rely on a server-side start timestamp. The React timer should calculate remaining_time = (start_time + duration) - current_server_time to prevent client-side clock manipulation cheating. 10. Conclusion
MasterStudy LMS represents a mature, feature-dense architecture. Its complexity stems from the intersection of Education Logic (pedagogy, grading, progression) and Business Logic (sales, memberships, affiliate marketing).
For a custom React/Django implementation, the critical path lies in robustly modeling the Course Hierarchy and the Access Control Engine. The data structures must support the flexibility of reusable content and polymorphic lesson types, while the frontend must deliver a seamless, state-aware experience that guides the user through the learning journey. By adhering to the logical structures outlined in this report, a development team can faithfully recreate the sophisticated behaviors of MasterStudy LMS within a modern, scalable application stack.
Works cited
Introduction | MasterStudy LMS Documentation - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms
MasterStudy LMS | Gato GraphQL for WordPress, accessed February 14, 2026, https://gatographql.com/guides/plugins/masterstudy-lms
Lessons | MasterStudy Theme Documentation - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-theme-documentation/lms-courses-features/masterstudy-theme-manual-lessons
Course & Lesson Materials | MasterStudy Theme Documentation - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-theme-documentation/lms-courses-features/course-and-lesson-materials
Course Builder | MasterStudy Theme Documentation | StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-theme-documentation/lms-courses-features/masterstudy-theme-manual-course-builder
Profiles | MasterStudy LMS Pro Plus - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/lms-settings/profiles
Questions | MasterStudy LMS Pro Plus - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/lms-course-features/questions
Trial Courses | MasterStudy LMS Pro Plus | StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/lms-pro-addons/trial-courses
Multi-instructors | MasterStudy Theme Documentation - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-theme-documentation/masterstudy-lms-pro-addons/masterstudy-theme-manual-multi-instructor
MasterStudy LMS - Settings: Complete Guide - YouTube, accessed February 14, 2026, https://www.youtube.com/watch?v=BJlw10yJBv0
Drip Content | MasterStudy LMS Pro Plus | StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/lms-pro-addons/drip-content
Drip Content | MasterStudy Theme Documentation - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-theme-documentation/masterstudy-lms-pro-addons/masterstudy-theme-manual-sequential-drip-content
Prerequisites | MasterStudy Theme Documentation - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-theme-documentation/masterstudy-lms-pro-addons/masterstudy-theme-manual-prerequisites
MasterStudy LMS WordPress Plugin – for Online Courses and Education, accessed February 14, 2026, https://wordpress.org/plugins/masterstudy-lms-learning-management-system/
MasterStudy LMS Integration with Bit Integrations, accessed February 14, 2026, https://bit-integrations.com/wp-docs/actions/masterstudy-lms-integrations-as-an-action/
Manage Students | MasterStudy LMS Pro Plus - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/lms-course-features/manage-students-by-admin
Quizzes | MasterStudy Theme Documentation - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-theme-documentation/lms-courses-features/masterstudy-theme-manual-quizzes
Quizzes | MasterStudy LMS Pro Plus | StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/lms-course-features/quizzes
Assignments | MasterStudy Theme Documentation | StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-theme-documentation/masterstudy-lms-pro-addons/masterstudy-theme-manual-assignments
Grades | MasterStudy LMS Pro Plus | StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/lms-pro-addons/grades
Instructors Requests | MasterStudy LMS Pro Plus - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/lms-course-features/instructors-requests
Instructor Settings | MasterStudy LMS Pro Plus - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/paypal-payouts-setup/instructor-settings
Private Messaging - Masterstudy - StylemixThemes, accessed February 14, 2026, https://stylemixthemes.com/masterstudy/private-messaging/
Paid Membership Pro | MasterStudy LMS Pro Plus - StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/additional-features/membership-system
Course Bundle | MasterStudy Theme Documentation | StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-theme-documentation/masterstudy-lms-pro-addons/masterstudy-theme-manual-course-bundles
Group Courses | MasterStudy LMS Pro Plus | StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/lms-pro-addons/group-courses
Point System | MasterStudy LMS Pro Plus | StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/lms-pro-addons/point-system
Certificate Builder | MasterStudy LMS Pro Plus | StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-lms/lms-pro-addons/certificate-builder#certificate-verification
Email Manager | MasterStudy Theme Documentation | StylemixThemes Docs, accessed February 14, 2026, https://docs.stylemixthemes.com/masterstudy-theme-documentation/masterstudy-lms-pro-addons/masterstudy-theme-manual-email-manager
