# MasterStudy LMS Core Logic

MasterStudy LMS organizes learning into **courses** composed of **sections** and **lessons**. Instructors create courses via a **Course Builder** (backend or front-end) by specifying title, description, category, difficulty level, featured image, etc. Each course’s **curriculum** is structured into sections, and instructors **add lessons** or assessments under each section. Lessons can be created anew or existing lessons (of various types) can be attached.  Instructors can add **unlimited sections and lessons**, labeling each section for logical organization【79†L289-L297】【79†L308-L317】. 

Courses have detailed **settings/tabs**. In the *Settings* tab instructors configure access (e.g. upcoming course status, trial courses, enrollment time limits) and **pricing**. The *Pricing* tab lets them choose between *Free*, *Paid*, or *Affiliate* models【81†L676-L685】【81†L697-L705】. For paid courses, instructors set one-time purchase price (with optional sale price/dates), enable **subscriptions** (recurring billing) and **group pricing**, exclude courses from membership plans, or allow purchase with points【81†L703-L712】【81†L722-L731】.  Only one pricing model is active per course【81†L670-L679】. Administrators enable advanced access features via Pro Addons: **Drip Content** (unlocking lessons only after prerequisite lessons/quizzes) and **Prerequisites** (requiring other courses to be completed before enrollment)【79†L334-L343】【79†L424-L433】. 

Once a course is created, the instructor uses the curriculum view to **build content**. Each course section can contain multiple *lesson* or *task* entries. Instructors click **“Add lessons”** to create a new lesson of a chosen type, or **“Search materials”** to attach existing lessons. The lesson types include **Text**, **Video**, **PDF**, **Stream (YouTube/live video)**, **Zoom meeting**, **Audio**, and **Google Meet** lessons【16†L282-L290】. For example, choosing a *Video* lesson presents fields to upload/embed a video file or link, poster image, duration, and set a **required watch %** (Pro feature) that students must view to mark it complete【21†L292-L300】. Each lesson record has its own title, duration, description, preview flag (open/free), and uploadable **materials** (attachments)【28†L190-L197】【28†L302-L310】. Assignments are added as a special *Lesson type*; students then complete them interactively (see below).

# Lesson & Quiz Details

Lesson content is delivered by type. For **Video lessons**, instructors can upload an HTML5 video or link to YouTube/Vimeo/Presto/VdoCipher, set a poster image, and enable features like *disable seeking*, *timecodes*, and *markers*【21†L292-L300】. *Text* lessons use rich text editors. *PDF* lessons allow uploading documents. *Stream* lessons embed live YouTube streams (with countdown). *Zoom* lessons integrate scheduled Zoom calls. *Audio* lessons (Pro) let instructors upload MP3/OGG/WAV or link Spotify/SoundCloud, and similarly set “required listen” progress points【28†L190-L197】【28†L302-L310】.

Instructors also create **Quizzes** (exams) to test students. A quiz is added in the course curriculum and can contain **unlimited questions**. In the quiz editor, instructors select or create questions of various types: *Single Choice*, *Multiple Choice*, *True/False*, *Matching* (text or image), *Keywords*, *Fill in the Blank*, *Ordering*, etc.【90†L193-L202】【90†L355-L364】. Questions are reusable entities stored in a question bank; instructors can add questions from any bank or create new ones on the spot【90†L223-L242】【90†L352-L360】. Each question includes the prompt, possible answers (text or image mode toggle), correct answers, and optional explanations (shown post-submission)【90†L400-L409】. 

A quiz’s **settings** allow configuring description, duration (e.g. 30 minutes), style (one-page or paginated), randomization of questions, number of attempts, and passing grade【93†L270-L279】【93†L293-L302】. Instructors can also set “points cut after retake” (penalty on second try)【93†L291-L300】 and enable showing correct answers. Quizzes can be globally styled via LMS Settings or overridden per quiz【93†L323-L332】【93†L334-L343】. The **Question Bank** feature lets instructors create named banks of related questions; when building a quiz they open a library window, search/filter questions, and add them in bulk【93†L380-L388】. 

After students take quizzes, instructors review results via the **Manage Students** interface (see below). For each student attempt, the instructor can inspect answers, mark scores, and identify areas for improvement. Quiz attempts, scores, and pass/fail outcomes are tracked per student-course.

# Assignments and Assessments

In the Pro version, instructors can add **Assignments** as lesson modules. An assignment lesson has configurable parameters (allowed attempts, attachment types and sizes, audio/video recording options)【95†L209-L218】. For each assignment, the instructor sets how many times a student may attempt it to earn a “Pass.” Students see a *“Start Assignment”* button, then an input area where they type text, attach files, or record audio/video answers【95†L307-L316】. After submitting, the assignment appears in a *Pending* state until graded.

Admins/instructors manage all assignments under an **Assignments dashboard**. This lists every assignment instance (across courses), showing total starts, passed, failed, and pending counts【95†L372-L381】. Clicking an assignment shows the **Student Assignments** list: each student’s submission(s) with date, attempts, and status【95†L394-L402】. Instructors click *Review* on a student entry to open the submission: they can view the student’s text/media, attach feedback files, and mark the assignment as Passed or Failed. Settings allow showing a “passed/failed” emoji on the student’s view【95†L241-L250】【95†L372-L381】. Essentially, each assignment creates a **StudentSubmission** record (with fields for text, attachments, status, grade) that instructors update by grading.

# Enrollment, Orders, and Access Control

Students **enroll** in courses either by free enrollment or purchase. For paid courses, MasterStudy creates an **Order** record when a student buys access【84†L199-L207】. The platform can integrate native payments, WooCommerce, or membership plugins, but the logic is similar: on successful payment the student is **automatically enrolled** and granted course access【84†L241-L250】【84†L262-L270】. Students (and instructors/admins) can view all their orders in a dashboard *Orders* tab, which lists order ID, date, status, and payment method【84†L278-L287】. Order statuses are *Completed* (student has access), *Pending* (awaiting payment approval), or *Cancelled*【84†L292-L300】. Offline or manual payments remain pending until admin confirmation.

Administrators review and manage orders via **MS LMS > Orders**. They can edit any order’s status or add internal notes【84†L355-L364】. Upon status changes (e.g. to Completed), the course is made accessible to the student. Both students and admins can export order lists or use advanced analytics. Instructors see their own course sales on a *My Sales* page (not detailed here), but orders flow is unified by the core LMS logic.

Courses may also be accessed via **Group Enrollments** or **Bundles** (pro features). A *Group Course* lets an admin/instructor set a discounted enterprise price; one user (group admin) buys for multiple students by providing their emails【37†L137-L146】. Each group has members with access managed via a “Groups” tab. A *Course Bundle* groups multiple courses under a single price. Bundles are created with a list of courses (same instructor), an image, and price, and displayed via widgets【43†L13-L20】. These rely on the underlying purchase/order logic to grant all included courses upon checkout.

LMS **access controls** include **Trial Courses** (limited-time free preview) and **Upcoming Status** (courses not yet open)【79†L395-L404】. In course settings an instructor can specify a trial duration or set the course “upcoming,” locking access until a date. There is also a **Time Limit** setting to expire course access after N days, which shows students a countdown【79†L395-L404】. All of these are workflow extensions on top of the enrollment model.

# Teacher (Instructor) Workflows

**Instructor accounts** have special privileges. Any user (if allowed) can request to become an instructor via a frontend form. Submitted **Instructor Requests** appear under *MS LMS > Instructor Requests* in admin. Each request shows the user’s information (including any uploaded documents) and buttons to approve or decline【109†L373-L382】. Admins can also ban users from reapplying【109†L378-L382】. On approval, the user’s role becomes Instructor (if Pre-Moderation is off, this can be automatic; otherwise admin manually changes it). The user is notified via email of the outcome【109†L386-L393】. This logic ensures only vetted users gain teaching rights.

Once an instructor, the user can **add courses** through their frontend dashboard/profile【79†L232-L241】. Instructors see a personalized “Add Course” button (also available in profile menus) that leads to the Course Builder interface【79†L236-L244】. They fill course info and create curriculum as above. Instructors can also manage their existing courses (edit, publish/unpublish), view enrolled student lists, and receive earnings. 

In the instructor dashboard they have **students management** for their own courses: in each course’s row a “Manage Students” button brings up that course’s enrollment list (see below). Instructors also have access to **course analytics** if enabled (Gradebook or Student Reports add-ons) showing average scores, progress, etc. 

For communication, instructors can post **Course Announcements**. These are messages emailed to all students in a course (requires SMTP and optional Email Manager). In their dashboard an instructor types a notice and selects the course; the system sends “Announcement from Instructor” emails to the course’s students. 

Instructors also have **public profiles**. When enabled, each instructor has a profile page displaying their bio, courses taught, and reviews. Students and site visitors can view these profiles. Instructors can update their bio and profile image in dashboard settings. Co-instructors (if multi-instructor add-on is on) also appear on course profiles.

Monetarily, instructors must configure payout details. They create a PayPal app and get a PayPal email for payouts【74†L193-L202】【74†L253-L262】. In the instructor dashboard’s *Payouts* section they enter that PayPal email to receive payments. Admins run the **Payouts Process** in *MS LMS > Statistics*: clicking “Create Payout” triggers PayPal transactions to all instructors with balances【77†L179-L188】【77†L197-L206】. The LMS tracks these via statuses (Pending→Success)【77†L214-L223】. All of this logic automates revenue sharing from course sales.

# Student Workflows and Experience

Students register as normal users, then browse or discover courses. For a free course they click “Enroll” and gain immediate access; for paid courses they **purchase** via a cart/checkout flow【84†L239-L247】. Students can add multiple courses to cart, choose payment method, and upon success they see an order confirmation. Once enrolled, students access a course via their dashboard or the course page. 

Inside a course, a student sees the **Course Page** listing sections/lessons. They click each lesson in order. Video lessons play (with playback tracking if enforced), text/PDF lessons display content, and so on. The LMS tracks **lesson completion**: typically a lesson is marked completed after viewing it. For quizzes, students click “Start Quiz”, answer questions, and submit. If scoring, their result is shown and stored. For assignments, students click “Start Assignment”, fill or record an answer, attach files, and submit; this creates a pending submission. They then await instructor grading.

Students also have their own **Manage Students** interface (frontend): they can see courses they’re enrolled in, their progress, and quizzes/assignments statuses. In the “My Orders” or “My Courses” pages students review what they bought and access course materials. If certificates are enabled, students can view/download a certificate after completing all required lessons/quizzes/assignments. 

Students can **leave reviews** on courses after enrollment. On the course page under “Reviews”, a student clicks *Write Review*, writes text, gives a 1–5 star rating, and submits. The review is held *pending* until admin approval【87†L271-L280】. Each student can only review a given course once, and instructors cannot review their own courses【87†L281-L284】. Approved reviews display on the course page. The aggregate rating affects the instructor’s profile rating (instructors are rated 1–5 stars from all their courses’ reviews)【87†L211-L219】.

Students can also access **point rewards** if the Points system is enabled. They earn points for actions (registration, purchasing courses, passing quizzes/assignments, completing lessons, etc.)【100†L288-L300】. Points are scored and can be spent: on a course’s checkout, a student has the option to pay with points if they have enough, with the interface showing how many points are needed【100†L219-L227】.

Each student has a **public profile** too. Once enabled, it shows their bio, completed courses (with “View Certificate” links) and platform stats【68†L461-L469】. Students can edit their profile in dashboard settings. There is an optional section showing overall platform progress (which can be turned off)【68†L465-L474】.

# Student Management and Administration

Administrators have robust tools to manage students. There is an **MS LMS > Students** tab listing every student account (name, email, join date, courses enrolled count, points)【71†L214-L223】. Admins can select students and remove them from **all** courses (deleting their progress, but not the user account)【71†L259-L267】. From this list, clicking *View* on a student opens detailed analytics (courses taken, progress, quiz results, purchases, reviews, etc.)【71†L263-L272】. Admins can also export the entire student list or a filtered subset to CSV【71†L281-L290】.

Per-course, admin and instructors have a **Manage Students** page. In *MS LMS > Courses*, each course row has a “Manage Students” button【71†L313-L320】. This opens a list of students enrolled in that course (name, email, start date, progress %). Here admins/instructors can remove a student from just that course by clicking a trash icon【71†L347-L356】. They can *Add Student* by entering an email to invite; this sends an enrollment email if the user isn’t already enrolled【71†L373-L379】. Student lists can be exported to or imported from CSV【71†L389-L397】, allowing batch enrollment (importing a CSV automatically enrolls those users into the course). 

For each student in this list, clicking *Progress* opens a detailed breakdown of completed lessons, quizzes, and assignments【71†L325-L334】【71†L335-L343】. Instructors and admins use this to monitor individual performance and can even uncheck a completed lesson to mark it incomplete (or reset quiz attempts) if needed. Overall, the system tracks each student’s progress data (what lessons are done, quiz scores, assignment statuses) which is stored per student-course enrollment.

# Additional Features

- **Certificates**: Admins create and assign certificates via the Certificate Builder addon【102†L206-L215】. Using a drag‑and‑drop interface, they design templates with dynamic fields (student name, course name, date, unique code, instructor names, etc.)【102†L232-L242】【102†L254-L263】. Each certificate template can be linked to one or more courses/categories. When a student completes a course (usually by reaching 100% progress and meeting pass criteria), the system generates the certificate record. Students can download it from their profile or course completion page.

- **Course Categories and Levels**: Courses can be classified by category and difficulty level (e.g. Beginner, Intermediate, Advanced). Category taxonomy allows users to filter courses on frontend. Instructors can create new categories if enabled in settings【79†L271-L279】. This classification helps organize content.

- **Communication and Widgets**: The LMS provides widgets for announcements and embedding quizzes. *Online Testing* (Pro addon) allows embedding a quiz on any page via shortcode; users can take it once (tracked by IP) as a practice quiz. *Instructor Announcements* let teachers email all their course’s students. If H5P or forums are integrated, discussions may appear on lesson pages (not detailed here).

- **Public Profiles**: Both instructor and student public profiles showcase activity. An instructor profile lists courses taught, co-instructors, bundles, and reviews (each course’s overall rating)【87†L211-L219】. A student profile (once enabled) shows completed courses (with “View Certificate” buttons), bio, and stats【68†L461-L469】. These pages are theme-driven templates but data is pulled from the LMS backend.

- **Multi-Instructors** (Pro): A course can have co-instructors. Admins activate the add-on, then in a course’s settings the owner can assign co-instructor users. Co-instructors share management rights: they can add/edit lessons and quizzes they created, view course students, post announcements, and manage reviews【43†L13-L20】. However, only the main instructor (or those they designate) can change core course info or price.

- **Statistics and Gradebook** (Pro): Instructors can enable a Gradebook to view all their students’ quiz and assignment grades. An admin-level *Analytics* dashboard reports overall platform revenue and course sales. Instructors have a “Payouts” tab showing their earnings summary, and a “Statistics” page for course-level performance metrics (student counts, quiz pass rates, etc.).

- **Subscription & Membership Plans** (Pro): Courses can be sold via recurring plans. Admins and instructors define *Subscription* products (on individual courses) or *Membership* plans (bundles of courses or categories with a monthly/yearly fee). Students subscribe via frontend; the LMS handles recurring payments and enrollment. Instructors can view subscriptions revenue under “My Sales.” Membership exclusion flags allow marking certain courses not included in a given plan.

- **Point System** (Pro): Points reward gamification. Settings let admin define point earnings for actions (registration, purchase, passing quizzes/assignments, completing lessons, affiliate referrals, etc.)【100†L288-L300】. Students see their point balance in dashboard. At checkout, if a student lacks points, the LMS shows how many more are needed; if they have enough, they may pay with points【100†L219-L227】.

# Data Entities and Flows

While not code-level, the underlying data model implied includes:
- **Users**: with roles (Admin, Instructor, Student). Instructors have profiles, PayPal info.
- **Courses**: attributes (title, slug, image, description, status, category, level, price, currency, etc.), access settings (open date, limit, prerequisites).
- **Sections**: belong to a course, have title and order.
- **Lessons**: belong to a section, have type (enum), content fields (text, video URL/file, PDF file, Zoom ID, etc.), attachments.
- **Quizzes**: belong to a course (or section), have title, description, settings (duration, attempts, pass grade).
- **Questions**: separate entities (can be global), with type, prompt, answers, correct answer(s), explanation.
- **Assignments**: similar to lessons, with config for attempts, attachments, etc.
- **Enrollments**: linking students to courses, tracking progress (percentage, time started, etc.).
- **QuizAttempts**: linking student, quiz, storing answers, score, date.
- **AssignmentSubmissions**: linking student, assignment, with content and status.
- **Orders**: linking student, course(s), amount, payment method, status (complete/pending).
- **Groups/Bundles/Subscriptions**: group structures linking multiple students to a course, or multiple courses to a product.
- **Certificates**: linked to course completion for a student, following a template.
- **Reviews**: linking student, course, with rating and text and status.
- **Points & Transactions**: ledger of points awarded/spent per user action.

These entities support workflows such as **course creation** (instructor forms courses and lessons), **enrollment** (student order → enrollment record), **consumption** (mark lessons as done → update enrollment.progress), **assessment** (student completes quiz/assignment → create attempt/submission record), and **grading** (instructor updates grades in attempt). The LMS provides interfaces in both frontend (React could simulate these dashboards) and admin backend (Django could serve APIs) for all these operations.

Each feature above is documented in StylemixThemes’ MasterStudy LMS docs and encapsulates the “business logic” of MasterStudy LMS. As a design inspiration, one would recreate these data models and flows in a React/Django application: courses with sections/lessons, quiz creation and attempt logic, assignment submission and grading, student enrollment and progress tracking, and so on. 

**Sources:** Official MasterStudy LMS documentation covers all the above features in detail【79†L289-L297】【93†L293-L302】【95†L241-L250】【71†L347-L356】【84†L199-L207】【87†L263-L272】【109†L373-L382】【102†L206-L215】【100†L219-L227】.