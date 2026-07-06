import logging
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from apps.core.models import Program, InstructorProfile
from apps.curriculum.models import CurriculumNode
from apps.assessments.models import Quiz, Question, QuestionOption
from apps.content.models import ContentBlock
from apps.blueprints.models import AcademicBlueprint
from django.core.management import call_command

User = get_user_model()
logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Seeds the comprehensive DevOps Engineering Mastery course (DEVOPS-401) with thorough lesson content, realistic durations, and quizzes.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--instructor-email',
            type=str,
            default='mary@instructor.com',
            help='Email of the instructor to assign to the course.'
        )

    def handle(self, *args, **options):
        instructor_email = options['instructor_email']
        self.stdout.write(self.style.NOTICE(f"=== Seeding DevOps Engineering Mastery (DEVOPS-401) for {instructor_email} ==="))

        with transaction.atomic():
            # 1. Get or create instructor
            instructor_user, _ = User.objects.get_or_create(
                email=instructor_email,
                defaults={
                    'username': instructor_email.split('@')[0],
                    'first_name': 'Mary',
                    'last_name': 'Jenkins',
                    'is_staff': True,
                    'is_active': True
                }
            )
            InstructorProfile.objects.get_or_create(
                user=instructor_user,
                defaults={
                    'bio': 'Principal DevOps Architect and Cloud Infrastructure Expert with 15+ years of industry experience.',
                    'headline': 'Cloud & DevOps Specialist | AWS & Kubernetes Certified',
                    'is_verified': True
                }
            )

            # 2. Get blueprint
            blueprint = AcademicBlueprint.objects.first()

            # 3. Define Course Data
            course_code = "DEVOPS-401"
            course_name = "DevOps Engineering Mastery"
            course_desc = (
                "<h3>Welcome to DevOps Engineering Mastery</h3>"
                "<p>This advanced, comprehensive certification course is engineered to transform developers, systems administrators, and infrastructure professionals into elite DevOps Engineers. You will master the cultural philosophies, architectural patterns, and industry-standard tools required to automate, scale, and secure modern cloud-native applications.</p>"
                "<p>Through in-depth theoretical deep-dives, architectural case studies, hands-on configuration guides, and graded knowledge evaluations, you will gain production-ready proficiency across the entire software delivery lifecycle.</p>"
                "<h4>Core Competencies Covered:</h4>"
                "<ul>"
                "<li><strong>DevOps Culture & CALMS:</strong> Breaking down organizational silos and implementing DORA metrics.</li>"
                "<li><strong>Containerization:</strong> Linux namespaces, cgroups, Docker Engine, and multi-stage Dockerfile optimization.</li>"
                "<li><strong>Kubernetes Orchestration:</strong> Cluster architecture, Declarative YAML manifests, Deployments, Services, Ingress, and StatefulSets.</li>"
                "<li><strong>CI/CD Pipelines:</strong> Automated testing, security scanning (DevSecOps), and Jenkins declarative pipeline-as-code.</li>"
                "<li><strong>Infrastructure as Code (IaC):</strong> HashiCorp Configuration Language (HCL), Terraform state locking, remote backends, and reusable module design.</li>"
                "<li><strong>System Observability:</strong> The three pillars (Metrics, Logs, Traces), Prometheus pull-based scraping, PromQL, and Grafana dashboarding.</li>"
                "</ul>"
            )
            what_you_learn = (
                "<ul>"
                "<li>Implement organizational DevOps culture using the CALMS framework and measure performance with DORA metrics.</li>"
                "<li>Architect, build, and optimize secure, multi-stage Docker container images for microservices.</li>"
                "<li>Deploy, scale, and manage resilient containerized workloads across Kubernetes clusters using Declarative YAML manifests.</li>"
                "<li>Configure Kubernetes networking including ClusterIP, NodePort, LoadBalancer services, and Ingress routing.</li>"
                "<li>Design and construct end-to-end automated CI/CD pipelines in Jenkins with integrated automated testing and vulnerability scanning.</li>"
                "<li>Provision and manage immutable cloud infrastructure declaratively using Terraform, remote backends, and modular HCL code.</li>"
                "<li>Implement comprehensive system observability using Prometheus metrics collection, PromQL querying, and interactive Grafana dashboards.</li>"
                "</ul>"
            )
            thumbnail_url = "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop"

            program, created = Program.objects.get_or_create(
                code=course_code,
                defaults={
                    "name": course_name,
                    "description": course_desc,
                    "what_you_learn_html": what_you_learn,
                    "blueprint": blueprint,
                    "is_published": True,
                    "level": "Advanced",
                    "duration_hours": 60,
                    "video_hours": 25,
                    "category": "DevOps",
                    "badge_type": "special"
                }
            )
            if not created:
                program.name = course_name
                program.description = course_desc
                program.what_you_learn_html = what_you_learn
                program.level = "Advanced"
                program.duration_hours = 60
                program.video_hours = 25
                program.category = "DevOps"
                program.save()

            if not program.custom_pricing.get("thumbnail_url"):
                program.custom_pricing["thumbnail_url"] = thumbnail_url
                program.save()

            if instructor_user not in program.instructors.all():
                program.instructors.add(instructor_user)

            # 4. Purge existing curriculum nodes for clean re-seeding
            self.stdout.write("Purging existing curriculum nodes for DEVOPS-401 to ensure a clean build...")
            CurriculumNode.objects.filter(program=program).delete()

            # 5. Define Modules and Lessons Structure
            modules_data = [
                {
                    "title": "Module 1: DevOps Culture & Containerization Fundamentals",
                    "description": "Introduction to organizational DevOps culture, DORA metrics, Linux container virtualization, and Docker engine fundamentals.",
                    "lessons": [
                        {
                            "title": "The Philosophy and Business Case for DevOps",
                            "desc": "Explore the historical evolution of software engineering, the conflict between development and operations, and how DevOps bridges the gap to deliver business value.",
                            "duration": "45m",
                            "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>The Historical Evolution of Software Engineering</h2>"
                                "<p>For decades, software development was dominated by traditional Waterfall methodologies. In these sequential models, development teams spent months or years writing code based on static requirements, only to hand the completed artifact over 'the wall of confusion' to IT operations teams for deployment. This separation of concerns created fundamentally conflicting incentives: developers were evaluated on the speed and volume of features delivered, while operations professionals were judged on system stability and uptime.</p>"
                                "<h3>The Wall of Confusion and Siloed Teams</h3>"
                                "<p>When developers hand off code without accountability for how it runs in production, quality inevitably suffers. Operations teams, lacking deep insight into the application's internal architecture, respond to instability by erecting bureaucratic change control boards and lengthening release cycles. This adversarial dynamic results in slow deployments, high failure rates, and employee burnout.</p>"
                                "<h2>What is DevOps?</h2>"
                                "<p>DevOps is not a single tool, programming language, or team title; it is an organizational and cultural philosophy paired with technical practices that automate and integrate the processes between software development and IT operations. By establishing cross-functional teams responsible for the entire lifecycle of an application—from design and coding to production deployment and monitoring—DevOps aligns incentives around delivering continuous value to the end user.</p>"
                                "<h3>The Business Value of DevOps and DORA Metrics</h3>"
                                "<p>The DevOps Research and Assessment (DORA) organization has spent over a decade surveying thousands of tech organizations worldwide. Their research demonstrates conclusively that high-performing DevOps teams achieve superior business outcomes. DORA measures software delivery performance across four key metrics:</p>"
                                "<ul>"
                                "<li><strong>Deployment Frequency (DF):</strong> How often an organization successfully releases code to production. High performers deploy multiple times per day.</li>"
                                "<li><strong>Lead Time for Changes (LTC):</strong> The amount of time it takes for a commit to go from version control into production. Elite teams achieve lead times of less than one hour.</li>"
                                "<li><strong>Mean Time to Restore (MTTR):</strong> How long it takes to recover from a production failure or service outage. High performers recover in under an hour.</li>"
                                "<li><strong>Change Failure Rate (CFR):</strong> The percentage of deployments causing a failure in production that requires remediation (e.g., hotfix, rollback). Elite teams maintain CFRs below 15%.</li>"
                                "</ul>"
                                "<p>By mastering DevOps engineering practices, you empower organizations to innovate rapidly without sacrificing system reliability or security.</p>"
                            )
                        },
                        {
                            "title": "Deep Dive into the CALMS Framework",
                            "desc": "An exhaustive breakdown of Culture, Automation, Lean, Measurement, and Sharing as the five pillars of organizational DevOps transformation.",
                            "duration": "50m",
                            "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Understanding the CALMS Framework</h2>"
                                "<p>Coined by Jez Humble and John Willis, the <strong>CALMS</strong> framework serves as a comprehensive conceptual model for evaluating and guiding an organization's DevOps adoption. Technology alone cannot solve organizational dysfunction; true DevOps maturity requires holistic progress across all five pillars.</p>"
                                "<h3>1. Culture (C)</h3>"
                                "<p>Culture is the bedrock of DevOps. It emphasizes psychological safety, mutual trust, and shared ownership over individual heroism or finger-pointing. When incidents occur in production, high-performing teams conduct <em>blameless post-mortems</em>. Instead of asking 'Who caused this outage?', the team investigates 'What systemic weakness or missing safeguard allowed this failure to occur?'. This shift fosters transparency and continuous learning.</p>"
                                "<h3>2. Automation (A)</h3>"
                                "<p>In traditional IT environments, manual tasks—such as configuring servers, executing database migrations, and deploying code—are the primary source of human error and deployment bottlenecks. DevOps seeks to automate every repeatable process across the software delivery pipeline. Key automation domains include Continuous Integration (CI), Continuous Delivery (CD), Automated Testing, and Infrastructure as Code (IaC).</p>"
                                "<h3>3. Lean (L)</h3>"
                                "<p>Adapted from Lean manufacturing principles developed by Toyota, Lean in DevOps focuses on eliminating waste and optimizing the flow of value to the customer. Core Lean practices include:</p>"
                                "<ul>"
                                "<li><strong>Limiting Work in Progress (WIP):</strong> Reducing multitasking to ensure teams finish current tasks before starting new ones.</li>"
                                "<li><strong>Small Batch Sizes:</strong> Releasing small, incremental code changes rather than massive, infrequent releases. Small batches are easier to review, test, and rollback if necessary.</li>"
                                "<li><strong>Value Stream Mapping:</strong> Visualizing the end-to-end process of delivering a feature to identify bottlenecks and eliminate non-value-adding activities.</li>"
                                "</ul>"
                                "<h3>4. Measurement (M)</h3>"
                                "<p>You cannot improve what you do not measure. DevOps organizations implement comprehensive telemetry across both application performance and delivery pipelines. By collecting metrics on server utilization, request latency, error rates, and deployment frequency, teams make data-driven decisions rather than relying on intuition.</p>"
                                "<h3>5. Sharing (S)</h3>"
                                "<p>Sharing breaks down information silos across departments. Developers share tooling and code with operations; operations share monitoring dashboards and infrastructure constraints with developers. Practices such as internal open-source (innersource), engineering demos, and documentation wikis ensure that knowledge is democratized across the entire engineering organization.</p>"
                            )
                        },
                        {
                            "title": "Virtualization vs. Containerization Architecture",
                            "desc": "Understand the architectural differences between Type 1/Type 2 Hypervisors, Virtual Machines, and OS-level container virtualization using Linux namespaces and cgroups.",
                            "duration": "1h 15m",
                            "image": "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>The Evolution of Compute Isolation</h2>"
                                "<p>To deploy software reliably, applications must be isolated from one another so that dependency conflicts, resource starvation, and security vulnerabilities do not cascade across systems. Over the past three decades, industry approaches to compute isolation have evolved from bare-metal servers to virtual machines, and finally to OS-level containerization.</p>"
                                "<h3>Hypervisor-Based Virtualization (Virtual Machines)</h3>"
                                "<p>Virtual Machines (VMs) rely on a piece of software called a Hypervisor (Type 1 bare-metal like VMware ESXi or Type 2 hosted like VirtualBox) to emulate physical hardware. Each VM runs a complete guest Operating System—including its own kernel, device drivers, and system libraries—on top of the virtualized hardware.</p>"
                                "<p>While VMs provide robust isolation, they carry significant overhead. Booting a VM takes minutes because an entire OS must initialize. Furthermore, each VM consumes gigabytes of disk space and dedicated RAM just to maintain the guest kernel, leading to low compute density on host servers.</p>"
                                "<h3>OS-Level Virtualization (Containers)</h3>"
                                "<p>Containers take a fundamentally different approach: instead of virtualizing hardware to run multiple operating systems, containers virtualize the operating system kernel itself. All containers running on a host machine share a single Linux kernel while maintaining completely isolated file systems, process trees, and networking stacks.</p>"
                                "<h2>How Linux Powers Containers: Namespaces and cgroups</h2>"
                                "<p>Containers are not magic; they are built directly upon two core features of the Linux kernel:</p>"
                                "<ul>"
                                "<li><strong>Linux Namespaces:</strong> Namespaces wrap global system resources into an abstraction that makes it appear to the processes within the namespace that they have their own isolated instance of the resource. Key namespaces include:<ul>"
                                "<li><code>pid</code> (Process ID): Isolates the process ID space so a container cannot see processes outside its environment.</li>"
                                "<li><code>net</code> (Network): Provides an isolated network stack, including routing tables, IP addresses, and firewall rules.</li>"
                                "<li><code>mnt</code> (Mount): Isolates file system mount points, giving each container its own root file system.</li>"
                                "<li><code>ipc</code> and <code>uts</code>: Isolate inter-process communication and hostname identifiers.</li>"
                                "</ul></li>"
                                "<li><strong>Control Groups (cgroups):</strong> While namespaces isolate what a process can <em>see</em>, cgroups limit and account for what a process can <em>use</em>. cgroups enforce strict limits on CPU utilization, memory consumption, disk I/O, and network bandwidth, preventing a rogue container from starving neighbors on the host.</li>"
                                "</ul>"
                                "<p>Because containers avoid the overhead of running a guest OS kernel, they start in milliseconds, consume mere megabytes of disk space, and allow dozens or hundreds of containerized applications to run efficiently on a single physical host.</p>"
                            )
                        },
                        {
                            "title": "Mastering Docker: Images, Containers, and Dockerfiles",
                            "desc": "Hands-on guide to building multi-stage Docker images, writing optimized Dockerfiles, and managing container lifecycles with Docker CLI.",
                            "duration": "1h 30m",
                            "image": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>The Docker Platform Architecture</h2>"
                                "<p>Docker democratized containerization by providing a standardized, developer-friendly API and tooling ecosystem around Linux kernel isolation features. The Docker architecture uses a client-server model consisting of three main components:</p>"
                                "<ul>"
                                "<li><strong>Docker Daemon (dockerd):</strong> The background server process responsible for managing container objects, building images, and interacting with the Linux kernel via <code>containerd</code> and <code>runc</code>.</li>"
                                "<li><strong>Docker Client (docker CLI):</strong> The primary command-line interface through which developers issue commands (such as <code>docker run</code> or <code>docker build</code>) to the Docker Daemon via REST APIs.</li>"
                                "<li><strong>Docker Registries:</strong> Remote repositories (such as Docker Hub, AWS ECR, or GitHub Container Registry) where built Docker images are stored and distributed.</li>"
                                "</ul>"
                                "<h2>Anatomy of a Dockerfile</h2>"
                                "<p>A <code>Dockerfile</code> is a plain-text configuration file containing sequential instructions that assemble a Docker image. Every instruction in a Dockerfile creates a read-only layer in the image; when a container launches, Docker adds a thin read-write layer on top of these read-only layers using Union File Systems (OverlayFS).</p>"
                                "<h3>Essential Dockerfile Instructions</h3>"
                                "<ul>"
                                "<li><code>FROM &lt;image&gt;</code>: Defines the base image (e.g., <code>node:18-alpine</code> or <code>python:3.11-slim</code>) upon which subsequent layers are built.</li>"
                                "<li><code>WORKDIR &lt;path&gt;</code>: Sets the working directory inside the container for all subsequent commands.</li>"
                                "<li><code>COPY &lt;src&gt; &lt;dest&gt;</code>: Copies files or directories from the host machine's build context into the container filesystem.</li>"
                                "<li><code>RUN &lt;command&gt;</code>: Executes shell commands during the build process (e.g., installing software packages via <code>apt-get</code> or <code>npm install</code>).</li>"
                                "<li><code>EXPOSE &lt;port&gt;</code>: Documents the network port on which the container listens at runtime.</li>"
                                "<li><code>ENTRYPOINT [\"executable\"]</code> and <code>CMD [\"param1\"]</code>: Define the default command executed when the container starts.</li>"
                                "</ul>"
                                "<h2>Best Practices: Multi-Stage Builds and Security</h2>"
                                "<p>In production environments, image size and security are paramount. Developing a Node.js or Go application requires compilers, SDKs, and build tools that are unnecessary—and present a security risk—at runtime.</p>"
                                "<p><strong>Multi-stage builds</strong> allow you to use multiple <code>FROM</code> statements in a single Dockerfile. You can compile your application in a heavy SDK build stage, and then copy ONLY the compiled binary or runtime artifacts into a lightweight production stage (such as <code>alpine</code> or <code>distroless</code>):</p>"
                                "<pre><code># Stage 1: Build\nFROM golang:1.21 AS builder\nWORKDIR /app\nCOPY . .\nRUN go build -o myapp\n\n# Stage 2: Production Runtime\nFROM gcr.io/distroless/static-debian11\nCOPY --from=builder /app/myapp /myapp\nUSER 1000:1000\nENTRYPOINT [\"/myapp\"]</code></pre>"
                                "<p>Notice the inclusion of <code>USER 1000:1000</code>. By default, Docker containers run as the root user. To adhere to the principle of least privilege, always explicitly switch to a non-root user before executing your application.</p>"
                            )
                        },
                        {
                            "title": "Module 1 Comprehensive Assessment",
                            "desc": "Evaluate your mastery of DevOps culture, DORA metrics, container architecture, and Dockerfile optimization.",
                            "duration": "30m",
                            "type": "quiz",
                            "questions": [
                                {
                                    "type": "mcq",
                                    "text": "Which of the four DORA metrics measures the percentage of deployments causing a failure in production that requires remediation?",
                                    "points": 10,
                                    "options": [
                                        "Mean Time to Restore (MTTR)",
                                        "Lead Time for Changes (LTC)",
                                        "Change Failure Rate (CFR)",
                                        "Deployment Frequency (DF)"
                                    ],
                                    "correct": 2
                                },
                                {
                                    "type": "true_false",
                                    "text": "Unlike Virtual Machines, containers virtualize the underlying physical hardware and require a dedicated guest operating system kernel for each container.",
                                    "points": 10,
                                    "correct": False
                                },
                                {
                                    "type": "mcq",
                                    "text": "Which Linux kernel feature is responsible for isolating process IDs, network stacks, and mount points so containers cannot observe external system resources?",
                                    "points": 10,
                                    "options": [
                                        "Control Groups (cgroups)",
                                        "Linux Namespaces",
                                        "OverlayFS Union File System",
                                        "SELinux / AppArmor"
                                    ],
                                    "correct": 1
                                },
                                {
                                    "type": "mcq",
                                    "text": "What is the primary benefit of using Multi-Stage Builds in a Dockerfile?",
                                    "points": 10,
                                    "options": [
                                        "It allows multiple containers to run simultaneously from a single Dockerfile.",
                                        "It bypasses Linux cgroups memory limits during compilation.",
                                        "It enables separating heavy compilation dependencies from the final production image, reducing image size and attack surface.",
                                        "It automatically configures SSL/TLS certificates for container networking."
                                    ],
                                    "correct": 2
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Module 2: Container Orchestration with Kubernetes",
                    "description": "Master Kubernetes cluster control plane architecture, workload YAML manifests, networking services, and persistent storage.",
                    "lessons": [
                        {
                            "title": "Kubernetes Cluster Architecture & Control Plane",
                            "desc": "Examine the internal workings of the Kubernetes Control Plane and Worker Nodes, including etcd, kube-apiserver, kube-scheduler, and kubelet.",
                            "duration": "1h 00m",
                            "image": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Why Container Orchestration is Essential</h2>"
                                "<p>While Docker makes it easy to package and run individual containers on a single host, running microservices architectures at enterprise scale introduces massive operational complexities. How do you deploy thousands of containers across dozens of physical or virtual servers? How do you handle load balancing, self-healing, rolling updates, and network routing without human intervention?</p>"
                                "<p><strong>Kubernetes (K8s)</strong>, originally developed by Google and now maintained by the Cloud Native Computing Foundation (CNCF), is the de facto open-source standard for automating the deployment, scaling, and management of containerized applications.</p>"
                                "<h2>Anatomy of a Kubernetes Cluster</h2>"
                                "<p>A Kubernetes cluster consists of two primary tiers: the <strong>Control Plane</strong> (which makes global decisions about the cluster) and one or more <strong>Worker Nodes</strong> (which host and execute the containerized applications).</p>"
                                "<h3>The Control Plane Components</h3>"
                                "<ul>"
                                "<li><code>kube-apiserver</code>: The frontend and gateway for the Kubernetes control plane. It exposes the Kubernetes HTTP REST API, processes YAML/JSON manifests, and handles authentication, authorization, and admission control. All communication between components flows through the API server.</li>"
                                "<li><code>etcd</code>: A highly available, consistent, distributed key-value store used as Kubernetes' backing store for all cluster data and configuration state. Never interact with etcd directly; only the API server queries and updates it.</li>"
                                "<li><code>kube-scheduler</code>: Monitors newly created Pods that have no assigned node and selects an optimal worker node for them to run on, taking into account resource requests, hardware constraints, affinity rules, and data locality.</li>"
                                "<li><code>kube-controller-manager</code>: Runs background controller loops (such as the Node Controller, ReplicaSet Controller, and Endpoint Controller) that continuously monitor the actual state of the cluster and work to reconcile it toward the desired state defined by the user.</li>"
                                "</ul>"
                                "<h3>The Worker Node Components</h3>"
                                "<ul>"
                                "<li><code>kubelet</code>: An agent that runs on every worker node in the cluster. It receives Pod definitions from the API server and interacts with the container runtime to ensure that the specified containers are running and healthy.</li>"
                                "<li><code>kube-proxy</code>: A network proxy running on each worker node that maintains network rules (using iptables or IPVS) to allow network communication to Pods from inside or outside the cluster.</li>"
                                "<li><strong>Container Runtime:</strong> The software responsible for running containers (such as <code>containerd</code> or CRI-O), implementing the Kubernetes Container Runtime Interface (CRI).</li>"
                                "</ul>"
                            )
                        },
                        {
                            "title": "Core Workload APIs: Pods, ReplicaSets, and Deployments",
                            "desc": "Learn how to define and manage Kubernetes workloads using YAML manifests, understanding Pod lifecycle, ReplicaSets, and Deployment rollouts.",
                            "duration": "1h 15m",
                            "image": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Declarative Workload Management in Kubernetes</h2>"
                                "<p>In Kubernetes, you rarely create containers directly. Instead, you declare your desired system state using structured YAML manifests, and Kubernetes automatically creates and supervises the required resources.</p>"
                                "<h3>1. The Pod: The Fundamental Building Block</h3>"
                                "<p>A <strong>Pod</strong> is the smallest and simplest deployable object in Kubernetes. A Pod represents a single instance of a running process in your cluster and encapsulates one or more containers, storage volumes, a unique cluster IP address, and configuration options that govern how the containers should run.</p>"
                                "<p>When a Pod contains multiple containers (such as a primary web server and an Envoy logging sidecar), those containers are co-located and co-scheduled on the same physical worker node. They share the exact same network namespace (meaning they can communicate via <code>localhost</code>) and can share storage volumes.</p>"
                                "<h3>2. ReplicaSets: Ensuring High Availability</h3>"
                                "<p>Pods are ephemeral by nature; if a physical node crashes, the Pods on that node die and are not automatically restarted. A <strong>ReplicaSet</strong> is a controller that ensures a specified number of identical Pod replicas are running at all times. If a Pod is deleted or crashes, the ReplicaSet detects the deficit and spins up a replacement Pod immediately.</p>"
                                "<h3>3. Deployments: Managing Zero-Downtime Rollouts</h3>"
                                "<p>While ReplicaSets maintain a stable replica count, they do not handle application version upgrades cleanly. A <strong>Deployment</strong> is a higher-order resource that manages ReplicaSets and provides declarative updates for Pods.</p>"
                                "<p>When you update the container image version in a Deployment manifest and apply it, the Deployment Controller initiates a controlled <strong>Rolling Update</strong>:</p>"
                                "<ul>"
                                "<li>It creates a new ReplicaSet configured with the new container image version.</li>"
                                "<li>It incrementally scales up the new ReplicaSet while simultaneously scaling down the old ReplicaSet.</li>"
                                "<li>This ensures zero application downtime during deployments. If an error or health check failure occurs during rollout, the Deployment can automatically halt or execute an instant rollback to the previous revision using <code>kubectl rollout undo</code>.</li>"
                                "</ul>"
                            )
                        },
                        {
                            "title": "Service Discovery, Load Balancing, and Ingress",
                            "desc": "Master Kubernetes networking by configuring ClusterIP, NodePort, and LoadBalancer Services, along with Ingress Controllers for HTTP routing.",
                            "duration": "1h 15m",
                            "image": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>The Kubernetes Networking Model</h2>"
                                "<p>Kubernetes enforces a foundational networking architecture: every Pod in a cluster receives its own unique, routable IP address. Pods can communicate with any other Pod on any node across the cluster directly without needing NAT (Network Address Translation) or port mapping.</p>"
                                "<h2>Kubernetes Services: Stable Endpoints for Ephemeral Pods</h2>"
                                "<p>Because Pods are ephemeral and their IP addresses change whenever they are recreated by a Deployment or ReplicaSet, clients cannot rely on direct Pod IP addresses. A Kubernetes <strong>Service</strong> is an abstraction that defines a logical set of Pods (selected via label selectors) and provides a single, stable IP address and DNS name to access them.</p>"
                                "<h3>Types of Kubernetes Services</h3>"
                                "<ul>"
                                "<li><code>ClusterIP</code> (Default): Exposes the Service on an internal IP address reachable only from within the cluster. Used for internal microservice-to-microservice communication (e.g., frontend pod talking to backend database service).</li>"
                                "<li><code>NodePort</code>: Exposes the Service externally by opening a static port (between 30000–32767) on every worker node's IP address. Traffic sent to any node on that port is forwarded to the Service.</li>"
                                "<li><code>LoadBalancer</code>: Provisions an external cloud load balancer (e.g., AWS ALB or GCP Load Balancer) in supported cloud providers, automatically routing external internet traffic to the NodePorts and Pods.</li>"
                                "</ul>"
                                "<h2>Ingress Controllers and HTTP/S Routing</h2>"
                                "<p>While a LoadBalancer Service exposes a single IP address for a single service, provisioning a cloud load balancer for every microservice is prohibitively expensive and difficult to manage. An <strong>Ingress</strong> is an API object that manages external HTTP and HTTPS routing to internal ClusterIP services based on hostname and URL path rules.</p>"
                                "<p>To function, the cluster must run an <strong>Ingress Controller</strong> (such as Nginx Ingress, Traefik, or AWS Load Balancer Controller). The Ingress Controller acts as an enterprise reverse proxy, handling SSL/TLS certificate termination, path-based routing (e.g., sending <code>/api</code> to the backend service and <code>/app</code> to the frontend service), and rate limiting from a single public entry point.</p>"
                            )
                        },
                        {
                            "title": "Stateful Workloads, Storage Classes, and ConfigMaps",
                            "desc": "Manage persistent data across container restarts using PersistentVolumes (PV), PersistentVolumeClaims (PVC), StatefulSets, and configuration injection.",
                            "duration": "1h 00m",
                            "image": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Managing Data Persistence in Kubernetes</h2>"
                                "<p>By default, container file systems are transient. When a Pod crashes or is rescheduled to a different node, any data written to the container's local disk is permanently erased. While stateless web applications thrive in this environment, databases (like PostgreSQL, MongoDB, or Redis) require reliable persistent storage.</p>"
                                "<h3>The Persistent Storage Architecture</h3>"
                                "<p>Kubernetes decouples storage provisioning from Pod consumption using three key abstractions:</p>"
                                "<ul>"
                                "<li><strong>PersistentVolume (PV):</strong> A piece of storage in the cluster (such as an AWS EBS volume, NFS share, or local disk) provisioned by an administrator or dynamically created by a StorageClass. PVs exist independently of Pod lifecycles.</li>"
                                "<li><strong>PersistentVolumeClaim (PVC):</strong> A request for storage by a user or Pod. A PVC specifies the required size and access mode (e.g., ReadWriteOnce or ReadWriteMany). Kubernetes automatically binds the PVC to an appropriate PV.</li>"
                                "<li><strong>StorageClass:</strong> Enables dynamic volume provisioning. When a PVC requests a specific StorageClass, Kubernetes automatically invokes cloud provider APIs to create the underlying disk and PV on the fly without manual intervention.</li>"
                                "</ul>"
                                "<h2>StatefulSets vs. Deployments</h2>"
                                "<p>While Deployments manage stateless pods that can be scaled up or down in any order and share identical identities, databases require strict guarantees. A <strong>StatefulSet</strong> is the workload API used to manage stateful applications. StatefulSets provide:</p>"
                                "<ul>"
                                "<li><strong>Stable, unique network identifiers:</strong> Each pod receives a predictable DNS name (e.g., <code>mysql-0</code>, <code>mysql-1</code>) that persists across rescheduling.</li>"
                                "<li><strong>Ordered deployment and scaling:</strong> Pods are created sequentially (0, then 1, then 2) and terminated in reverse order, ensuring safe database replication initialization.</li>"
                                "<li><strong>Stable persistent storage:</strong> Each pod in a StatefulSet receives its own dedicated PVC and PV that is never automatically deleted if the pod restarts.</li>"
                                "</ul>"
                                "<h2>Configuration Injection: ConfigMaps and Secrets</h2>"
                                "<p>To follow the Twelve-Factor App methodology, configuration data and credentials must be kept separate from compiled container images. Kubernetes provides two resources for injecting configuration into Pods at runtime via environment variables or mounted files:</p>"
                                "<ul>"
                                "<li><code>ConfigMap</code>: Stores non-sensitive configuration data (such as application properties, feature flags, or Nginx config files) as key-value pairs.</li>"
                                "<li><code>Secret</code>: Stores sensitive data (such as database passwords, SSH keys, or TLS certificates). Secrets are stored in etcd (encrypted at rest in hardened clusters) and mounted into pods using tmpfs in-memory filesystems to prevent leaking to disk.</li>"
                                "</ul>"
                            )
                        },
                        {
                            "title": "Module 2 Comprehensive Assessment",
                            "desc": "Test your understanding of Kubernetes cluster components, workload YAML manifests, networking services, and persistent storage.",
                            "duration": "45m",
                            "type": "quiz",
                            "questions": [
                                {
                                    "type": "mcq",
                                    "text": "Which Kubernetes Control Plane component is the ONLY one that communicates directly with the etcd database?",
                                    "points": 10,
                                    "options": [
                                        "kube-scheduler",
                                        "kubelet",
                                        "kube-apiserver",
                                        "kube-controller-manager"
                                    ],
                                    "correct": 2
                                },
                                {
                                    "type": "mcq",
                                    "text": "What happens when you execute a Rolling Update on a Kubernetes Deployment?",
                                    "points": 10,
                                    "options": [
                                        "All existing Pods are terminated simultaneously before new Pods are created, causing brief downtime.",
                                        "A new ReplicaSet is created and incrementally scaled up while the old ReplicaSet is scaled down, ensuring zero downtime.",
                                        "The kubelet modifies the running container images directly on the worker nodes without recreating Pods.",
                                        "An external cloud load balancer automatically clones the virtual machines hosting the cluster."
                                    ],
                                    "correct": 1
                                },
                                {
                                    "type": "mcq",
                                    "text": "Which Kubernetes Service type opens a static port (30000–32767) on every worker node's IP address to route external traffic into the cluster?",
                                    "points": 10,
                                    "options": [
                                        "ClusterIP",
                                        "NodePort",
                                        "LoadBalancer",
                                        "ExternalName"
                                    ],
                                    "correct": 1
                                },
                                {
                                    "type": "true_false",
                                    "text": "When a Pod in a StatefulSet is deleted or restarted, its associated PersistentVolumeClaim (PVC) and underlying disk are automatically destroyed to prevent data corruption.",
                                    "points": 10,
                                    "correct": False
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Module 3: Continuous Integration & Continuous Delivery (CI/CD)",
                    "description": "Design automated build, test, and deployment pipelines using Jenkins declarative pipeline-as-code and DevSecOps practices.",
                    "lessons": [
                        {
                            "title": "Anatomy of an Enterprise CI/CD Pipeline",
                            "desc": "Understand the end-to-end software delivery lifecycle, from source code commit to automated build, test, artifact archiving, and production release.",
                            "duration": "50m",
                            "image": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Demystifying CI, CD, and Continuous Deployment</h2>"
                                "<p>Modern software engineering relies on continuous automation to deliver features rapidly while maintaining high quality standards. While the acronyms CI and CD are frequently used together, they represent distinct evolutionary stages in the software delivery pipeline:</p>"
                                "<h3>1. Continuous Integration (CI)</h3>"
                                "<p>Continuous Integration is the practice where developers merge their code changes into a central repository's main branch multiple times per day. Every commit automatically triggers an automated build and test sequence. The primary goal of CI is to provide rapid feedback: if a developer introduces a syntax error, breaks a unit test, or violates code formatting rules, the CI pipeline fails within minutes, allowing immediate remediation before the broken code infects other team members.</p>"
                                "<h3>2. Continuous Delivery (CD)</h3>"
                                "<p>Continuous Delivery extends Continuous Integration by ensuring that every codebase change that passes automated CI tests is packaged and automatically deployed to a non-production environment (such as Staging or User Acceptance Testing). In Continuous Delivery, the software is <em>always in a deployable state</em>, but the final release to live production customers requires an explicit, manual approval step by an engineering manager or product owner.</p>"
                                "<h3>3. Continuous Deployment</h3>"
                                "<p>Continuous Deployment is the ultimate automation maturity stage. In this model, there is no manual approval gate. Any code commit that passes all automated unit, integration, performance, and security tests in the pipeline is deployed directly into live production automatically. Achieving Continuous Deployment requires elite automated testing coverage, feature flags, and robust observability.</p>"
                                "<h2>The Standard Enterprise Pipeline Stages</h2>"
                                "<ol>"
                                "<li><strong>Source Checkout & Linting:</strong> Fetching source code from Git and enforcing code formatting and syntax rules using static analysis tools (e.g., ESLint, Flake8, Checkstyle).</li>"
                                "<li><strong>Compilation & Unit Testing:</strong> Compiling binaries or transpiling code, followed by executing fast unit tests that verify isolated functions without external database dependencies.</li>"
                                "<li><strong>Artifact Packaging:</strong> Building a container image (e.g., Docker) or packaging immutable binaries (e.g., JAR, Wheel) and tagging them with a unique commit SHA or semantic version.</li>"
                                "<li><strong>Integration & Security Testing:</strong> Running automated API tests, database integration checks, and security scans against the compiled artifact.</li>"
                                "<li><strong>Staging Deployment & Smoke Testing:</strong> Deploying the artifact to a staging environment and executing automated end-to-end user browser simulations (e.g., Playwright, Selenium).</li>"
                                "<li><strong>Production Release:</strong> Executing a zero-downtime release using Canary or Blue/Green deployment strategies.</li>"
                                "</ol>"
                            )
                        },
                        {
                            "title": "Jenkins Architecture and Distributed Build Agents",
                            "desc": "Set up and secure a Jenkins automation server using Controller-Agent architecture, managing plugins, credentials, and scalable build nodes.",
                            "duration": "1h 00m",
                            "image": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Why Jenkins Dominates Enterprise Automation</h2>"
                                "<p>Despite the proliferation of cloud-managed CI/CD services, <strong>Jenkins</strong> remains one of the most widely adopted open-source automation servers in enterprise software engineering. Its enduring popularity stems from its unmatched flexibility, self-hosted data sovereignty, and an ecosystem of over 1,800 community-maintained plugins that integrate with virtually every source control, testing, cloud, and notification tool in existence.</p>"
                                "<h2>The Controller-Agent Distributed Architecture</h2>"
                                "<p>Executing intensive CI/CD jobs—such as compiling large C++ codebases, running thousands of parallel browser tests, or building Docker images—requires massive compute and memory resources. Attempting to run these jobs directly on the central Jenkins server quickly leads to resource exhaustion and system crashes.</p>"
                                "<p>To achieve high performance and horizontal scalability, Jenkins enforces a strict distributed architecture consisting of two roles:</p>"
                                "<h3>1. The Jenkins Controller (Formerly Master)</h3>"
                                "<p>The Controller is the central management brain of Jenkins. It hosts the web user interface, stores pipeline configurations, manages credentials and security plugins, schedules build jobs, and dispatches tasks to available worker agents. <em>Best Practice:</em> Never allow build jobs to execute directly on the Controller. The Controller's executors should be set to 0 to preserve CPU and RAM exclusively for administrative scheduling and UI responsiveness.</p>"
                                "<h3>2. Jenkins Build Agents (Formerly Slaves / Nodes)</h3>"
                                "<p>Build Agents are worker machines (physical servers, virtual machines, or ephemeral Kubernetes Pods) configured to execute the actual heavy lifting of build scripts and test suites. Agents connect to the Controller via SSH or inbound TCP WebSockets (JNLP). You can label agents by capability (e.g., label <code>linux-docker</code> for Linux machines with Docker installed, or label <code>macos-xcode</code> for iOS build machines) so pipelines can dynamically request the appropriate hardware.</p>"
                                "<h2>Managing Secrets with the Credentials Provider</h2>"
                                "<p>CI/CD pipelines require access to highly sensitive secrets: AWS IAM secret keys, Kubernetes kubeconfig files, GitHub SSH keys, and Docker registry passwords. Hardcoding secrets in scripts or Git repositories is a catastrophic security violation.</p>"
                                "<p>Jenkins provides an encrypted centralized <strong>Credentials Store</strong>. Secrets are encrypted on disk using the Controller's master key. In pipeline scripts, developers reference secrets using unique alphanumeric IDs (via the <code>credentials()</code> helper function); Jenkins temporarily injects the decrypted secret into memory during execution and automatically scrubs and masks the value with asterisks (<code>****</code>) in build console logs.</p>"
                            )
                        },
                        {
                            "title": "Declarative Pipeline as Code with Jenkinsfiles",
                            "desc": "Write robust, maintainable Jenkins pipelines using Declarative Groovy syntax, incorporating stages, parallel execution, post-conditions, and shared libraries.",
                            "duration": "1h 30m",
                            "image": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>The Paradigm Shift: Pipeline as Code</h2>"
                                "<p>Historically, CI/CD workflows were configured manually by clicking through web form interfaces on build servers. This manual approach created fragile 'snowflake' configurations that could not be version-controlled, peer-reviewed, or easily restored after a server crash.</p>"
                                "<p><strong>Pipeline as Code</strong> solves this by defining the entire build, test, and deployment workflow in a plain-text file named <code>Jenkinsfile</code> committed directly into the root directory of the application's source code repository. When code is branched or audited, the exact pipeline definition that built that version is preserved alongside the application code.</p>"
                                "<h2>Declarative vs. Scripted Pipeline Syntax</h2>"
                                "<p>Jenkins supports two syntax flavors: Scripted Groovy (a free-form procedural programming language) and <strong>Declarative Pipeline</strong>. Declarative syntax is the modern, strongly recommended standard; it provides a simpler, opinionated, hierarchical structure that is easier to read, validate, and maintain.</p>"
                                "<h3>Anatomy of a Declarative Jenkinsfile</h3>"
                                "<pre><code>pipeline {\n    agent { label 'linux-docker' }\n    \n    environment {\n        APP_ENV = 'production'\n        DOCKER_CREDS = credentials('docker-hub-auth')\n    }\n    \n    stages {\n        stage('Lint & Unit Test') {\n            steps {\n                echo 'Executing code formatting checks...'\n                sh 'npm run lint'\n                sh 'npm run test:unit'\n            }\n        }\n        stage('Parallel Integration Tests') {\n            parallel {\n                stage('Database Tests') {\n                    steps { sh 'npm run test:db' }\n                }\n                stage('API Contract Tests') {\n                    steps { sh 'npm run test:api' }\n                }\n            }\n        }\n        stage('Build & Push Container') {\n            steps {\n                sh 'docker build -t myorg/myapp:${BUILD_NUMBER} .'\n                sh 'echo ${DOCKER_CREDS_PSW} | docker login -u ${DOCKER_CREDS_USR} --password-stdin'\n                sh 'docker push myorg/myapp:${BUILD_NUMBER}'\n            }\n        }\n    }\n    \n    post {\n        always {\n            junit 'reports/**/*.xml'\n            cleanWs()\n        }\n        failure {\n            mail to: 'devops-alerts@myorg.com', subject: \"Failed Build: ${JOB_NAME}\", body: \"Check console log.\"\n        }\n    }\n}</code></pre>"
                                "<h3>Key Structure Breakdown</h3>"
                                "<ul>"
                                "<li><code>pipeline</code>: The root block enclosing the entire pipeline definition.</li>"
                                "<li><code>agent</code>: Specifies where the pipeline or individual stage should execute.</li>"
                                "<li><code>environment</code>: Defines environment variables and injects encrypted credentials safely.</li>"
                                "<li><code>stages</code> and <code>stage</code>: Logical divisions of work. Using the <code>parallel</code> block allows independent stages (like API tests and Database tests) to run simultaneously across multiple build agents, dramatically slashing build times.</li>"
                                "<li><code>post</code>: Defines actions guaranteed to execute at the end of the pipeline based on completion status (<code>always</code>, <code>success</code>, <code>failure</code>, <code>unstable</code>). Essential for archiving JUnit test reports and wiping workspace directory clutter via <code>cleanWs()</code>.</li>"
                                "</ul>"
                            )
                        },
                        {
                            "title": "Automated Security Scanning & DevSecOps Integration",
                            "desc": "Embed security checks directly into your CI/CD pipeline with SAST (Static Application Security Testing), DAST, and container vulnerability scanning.",
                            "duration": "1h 15m",
                            "image": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Shifting Left on Security: The DevSecOps Revolution</h2>"
                                "<p>In traditional software development, security auditing was an isolated phase conducted by a separate information security team right before production deployment. When security penetration testers discovered architectural vulnerabilities at the end of a six-month release cycle, fixing them required massive rewrites, delaying releases and generating immense friction.</p>"
                                "<p><strong>DevSecOps</strong> integrates automated security controls and vulnerability scanning directly into every stage of the CI/CD pipeline. By 'shifting left'—moving security checks to the earliest stages of development—developers receive immediate feedback on security flaws while writing code, making remediation trivial and inexpensive.</p>"
                                "<h2>The Four Pillars of Pipeline Security Scanning</h2>"
                                "<h3>1. Static Application Security Testing (SAST)</h3>"
                                "<p>SAST tools analyze application source code, bytecode, or binaries at rest without executing the application. SAST scanners (such as SonarQube, Semgrep, Checkmarx, or Fortify) inspect code syntax for known vulnerability patterns, including SQL injection, Cross-Site Scripting (XSS), hardcoded passwords, buffer overflows, and insecure cryptography usage. SAST runs immediately during the compile/unit-test stage.</p>"
                                "<h3>2. Software Composition Analysis (SCA)</h3>"
                                "<p>Modern applications consist of 70% to 90% third-party open-source libraries and frameworks (e.g., npm packages, PyPI modules, Maven dependencies). SCA tools (such as OWASP Dependency-Check, Snyk, or GitHub Dependabot) scan the project's dependency manifest against global vulnerability databases (such as the National Vulnerability Database / CVE list). If a developer imports a library with a known high-severity exploit, the pipeline halts immediately.</p>"
                                "<h3>3. Container Image Scanning</h3>"
                                "<p>Even if application source code is secure, the underlying Docker base image may contain vulnerable Linux OS packages (such as outdated OpenSSL or glibc binaries). Container scanners (such as Trivy, Grype, or AWS ECR automated scanning) inspect compiled container images before they are pushed to production registries, flagging operating system CVEs and misconfigured filesystem permissions.</p>"
                                "<h3>4. Dynamic Application Security Testing (DAST)</h3>"
                                "<p>DAST tools (such as OWASP ZAP or Burp Suite) evaluate running applications from the outside by simulating external hacker attacks against staging environments. DAST scanners crawl web endpoints, injecting malicious payloads into form inputs, HTTP headers, and API parameters to detect runtime vulnerabilities such as authentication bypasses and CORS misconfigurations.</p>"
                                "<h2>Enforcing Automated Quality Gates</h2>"
                                "<p>To make DevSecOps effective, pipelines must enforce strict <strong>Quality Gates</strong>. A Quality Gate is a conditional pipeline rule: if a SAST scanner finds any 'Critical' or 'High' severity vulnerabilities, or if test coverage drops below 80%, the Jenkins pipeline automatically aborts with a failure status, blocking the merge or deployment until the engineering team resolves the security flaw.</p>"
                                "<h3>Secret Scanning in Version Control</h3>"
                                "<p>An often overlooked DevSecOps practice is automated pre-commit and pipeline secret scanning (using tools like GitGuardian, TruffleHog, or Gitleaks). These tools inspect Git commit histories for high-entropy strings and API key signatures, preventing developers from accidentally leaking cloud AWS keys or database passwords into remote Git repositories.</p>"
                            )
                        },
                        {
                            "title": "Module 3 Comprehensive Assessment",
                            "desc": "Evaluate your grasp of CI/CD pipeline design, Jenkins declarative syntax, distributed build architecture, and DevSecOps practices.",
                            "duration": "30m",
                            "type": "quiz",
                            "questions": [
                                {
                                    "type": "mcq",
                                    "text": "Why is it considered a critical security and performance best practice to set the Jenkins Controller's build executors to 0?",
                                    "points": 10,
                                    "options": [
                                        "Because Jenkins Controllers cannot execute Groovy scripts on Linux operating systems.",
                                        "To prevent heavy compilation jobs from crashing the management UI and to prevent arbitrary pull request code from accessing Controller encryption keys.",
                                        "Because Jenkins requires AWS Lambda to compile Docker containers.",
                                        "To ensure that all builds execute sequentially rather than in parallel."
                                    ],
                                    "correct": 1
                                },
                                {
                                    "type": "mcq",
                                    "text": "Which automated security testing methodology inspects application source code without executing it to detect vulnerabilities like SQL injection and hardcoded passwords?",
                                    "points": 10,
                                    "options": [
                                        "Dynamic Application Security Testing (DAST)",
                                        "Static Application Security Testing (SAST)",
                                        "Interactive Application Security Testing (IAST)",
                                        "Penetration Testing"
                                    ],
                                    "correct": 1
                                },
                                {
                                    "type": "mcq",
                                    "text": "In a Declarative Jenkinsfile, which block is used to execute cleanup steps like archiving test reports and wiping workspaces regardless of whether the build succeeded or failed?",
                                    "points": 10,
                                    "options": [
                                        "always",
                                        "finally",
                                        "post",
                                        "teardown"
                                    ],
                                    "correct": 2
                                },
                                {
                                    "type": "true_false",
                                    "text": "In Continuous Delivery, every codebase change that passes automated CI tests is automatically deployed directly to live production customers without any manual approval gates.",
                                    "points": 10,
                                    "correct": False
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Module 4: Infrastructure as Code (IaC) with Terraform",
                    "description": "Provision and manage cloud infrastructure programmatically using HashiCorp Configuration Language (HCL), remote backends, and reusable modules.",
                    "lessons": [
                        {
                            "title": "Declarative Infrastructure & HCL Fundamentals",
                            "desc": "Explore why Infrastructure as Code replaces manual cloud console management, and learn the syntax and structure of HashiCorp Configuration Language (HCL).",
                            "duration": "1h 00m",
                            "image": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>The Pitfalls of Manual Infrastructure Management</h2>"
                                "<p>Before Infrastructure as Code (IaC), systems administrators provisioned servers, databases, and networking components manually by clicking through web console UIs or running ad-hoc shell scripts. This manual approach suffers from fatal operational flaws:</p>"
                                "<ul>"
                                "<li><strong>Configuration Drift:</strong> Over time, manual tweaks applied to production servers cause environments to diverge from staging, leading to 'it works on my machine' deployment failures.</li>"
                                "<li><strong>Lack of Reproducibility:</strong> Rebuilding a complex cloud architecture after a regional disaster or spinning up a clone environment for performance testing requires days of tedious manual configuration with high human error rates.</li>"
                                "<li><strong>No Audit Trail:</strong> When infrastructure changes are made manually via web consoles, there is no peer review, no version history, and no way to trace who changed a firewall rule or why.</li>"
                                "</ul>"
                                "<h2>Why Declarative IaC with Terraform is Superior</h2>"
                                "<p><strong>Terraform</strong>, developed by HashiCorp, is an open-source tool that allows you to manage cloud and on-premise infrastructure safely and efficiently through plain-text configuration files. Terraform uses a <strong>Declarative</strong> approach: rather than writing procedural scripts detailing step-by-step instructions on <em>how</em> to build resources (imperative), you simply describe the desired end state of your infrastructure (what resources should exist), and Terraform's execution engine calculates the necessary API calls to achieve that state.</p>"
                                "<h3>Idempotency and Immutable Infrastructure</h3>"
                                "<p>Two core concepts underpin Terraform's reliability:</p>"
                                "<ul>"
                                "<li><strong>Idempotency:</strong> Running the exact same Terraform configuration ten times in a row will produce the exact same result without creating duplicate resources or throwing errors. If the real-world state already matches the configuration, Terraform does nothing.</li>"
                                "<li><strong>Immutable Infrastructure:</strong> Rather than updating existing virtual machines in-place (which invites configuration drift), immutable infrastructure replaces modified resources completely. If you change an EC2 instance's base image in Terraform, it terminates the old server and spins up a fresh, perfectly configured replacement.</li>"
                                "</ul>"
                                "<h2>The Terraform Core Workflow</h2>"
                                "<p>Working with Terraform revolves around three fundamental CLI commands:</p>"
                                "<ol>"
                                "<li><code>terraform init</code>: Initializes a working directory containing Terraform HCL files. It downloads required cloud provider plugins (e.g., AWS, Azure, GCP) and sets up the state backend.</li>"
                                "<li><code>terraform plan</code>: Generates an execution plan. Terraform inspects real-world cloud resources, compares them against your local HCL files and state, and prints a detailed dry-run diff showing exactly what will be created (+), modified (~), or destroyed (-) before making any changes.</li>"
                                "<li><code>terraform apply</code>: Executes the plan, making authenticated API calls to the cloud provider to build or alter infrastructure to match the configuration.</li>"
                                "</ol>"
                            )
                        },
                        {
                            "title": "Terraform Providers, Resources, and Data Sources",
                            "desc": "Connect Terraform to cloud APIs (AWS, GCP, Azure), declare infrastructure resources, and query existing infrastructure using Data Sources.",
                            "duration": "1h 15m",
                            "image": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Anatomy of HashiCorp Configuration Language (HCL)</h2>"
                                "<p>Terraform configurations are written in HCL, a human-readable configuration language designed specifically for DevOps infrastructure declaration. HCL is organized into distinct functional blocks.</p>"
                                "<h3>1. Provider Blocks</h3>"
                                "<p>A <strong>Provider</strong> is a plugin that translates Terraform HCL code into API calls for a specific cloud platform, SaaS tool, or database (e.g., AWS, Google Cloud, Azure, Cloudflare, Kubernetes, GitHub). The provider block configures authentication credentials and target regions:</p>"
                                "<pre><code>terraform {\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}\n\nprovider \"aws\" {\n  region = \"us-east-1\"\n}</code></pre>"
                                "<h3>2. Resource Blocks</h3>"
                                "<p><strong>Resources</strong> are the primary building blocks of a Terraform configuration. Each resource block describes one or more infrastructure objects—such as a virtual network, compute instance, DNS record, or IAM role. A resource block declares the resource type and a local resource name:</p>"
                                "<pre><code>resource \"aws_instance\" \"web_server\" {\n  ami           = \"ami-0c7217cdde317cfec\"\n  instance_type = \"t3.micro\"\n  \n  tags = {\n    Name        = \"Production-Web-01\"\n    Environment = \"Production\"\n  }\n}</code></pre>"
                                "<p>In this example, <code>aws_instance</code> is the resource type defined by the AWS provider, and <code>web_server</code> is the internal identifier used to reference this instance elsewhere in your Terraform code.</p>"
                                "<h3>3. Resource Dependencies and Interpolation</h3>"
                                "<p>Terraform automatically builds a dependency graph of all declared resources to determine the correct creation order. When you reference an attribute of one resource inside another (using interpolation syntax), Terraform establishes an <strong>implicit dependency</strong>:</p>"
                                "<pre><code>resource \"aws_security_group\" \"web_sg\" {\n  name        = \"allow_http\"\n  description = \"Allow HTTP inbound traffic\"\n}\n\nresource \"aws_instance\" \"web_server\" {\n  ami                    = \"ami-0c7217cdde317cfec\"\n  instance_type          = \"t3.micro\"\n  vpc_security_group_ids = [aws_security_group.web_sg.id] # Implicit dependency!\n}</code></pre>"
                                "<p>Because the instance references <code>aws_security_group.web_sg.id</code>, Terraform knows it must create the security group first before attempting to launch the EC2 instance. For edge cases where dependencies cannot be inferred from attributes, you can use the explicit <code>depends_on = [resource_name]</code> meta-argument.</p>"
                                "<h3>4. Data Sources</h3>"
                                "<p>While Resources <em>create and manage</em> infrastructure, <strong>Data Sources</strong> allow Terraform to <em>read and query</em> existing read-only data from a cloud provider. For example, instead of hardcoding an AMI ID (which changes frequently across regions), you can use a data source to dynamically query AWS for the latest official Ubuntu Linux AMI:</p>"
                                "<pre><code>data \"aws_ami\" \"latest_ubuntu\" {\n  most_recent = true\n  owners      = [\"099720109477\"] # Canonical\n\n  filter {\n    name   = \"name\"\n    values = [\"ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*\"]\n  }\n}\n\nresource \"aws_instance\" \"web\" {\n  ami           = data.aws_ami.latest_ubuntu.id\n  instance_type = \"t3.micro\"\n}</code></pre>"
                            )
                        },
                        {
                            "title": "State Management, Backends, and State Locking",
                            "desc": "Understand how Terraform tracks resource metadata using state files, configuring remote backends (S3 + DynamoDB) for secure team collaboration.",
                            "duration": "1h 15m",
                            "image": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Why Terraform State is Critical</h2>"
                                "<p>When you run <code>terraform apply</code>, how does Terraform know which real-world cloud resources correspond to which HCL blocks in your files? It accomplishes this by maintaining a structured JSON metadata file called the <strong>Terraform State</strong> (stored by default as a local file named <code>terraform.tfstate</code>).</p>"
                                "<p>The state file serves three vital functions:</p>"
                                "<ul>"
                                "<li><strong>Resource Mapping:</strong> It binds your declared HCL resource names (e.g., <code>aws_instance.web</code>) to unique cloud provider IDs (e.g., EC2 instance ID <code>i-0abcd1234ef567890</code>).</li>"
                                "<li><strong>Metadata & Dependency Tracking:</strong> It stores configuration metadata and resource dependencies required to destroy or modify infrastructure in the correct order.</li>"
                                "<li><strong>Performance Optimization:</strong> In massive cloud environments with thousands of resources, querying cloud provider APIs for every single resource during a <code>terraform plan</code> would take hours. Terraform uses cached state data to speed up plan generation.</li>"
                                "</ul>"
                                "<h2>Why Local State Fails for Teams</h2>"
                                "<p>While storing <code>terraform.tfstate</code> on your laptop's local hard drive works for solo experimentation, it is a catastrophic practice for engineering teams:</p>"
                                "<ul>"
                                "<li><strong>No Collaboration:</strong> If two engineers run Terraform from their local laptops, they have different, out-of-sync state files, inevitably leading to overwriting or destroying each other's cloud resources.</li>"
                                "<li><strong>Race Conditions:</strong> If two CI/CD pipelines or developers execute <code>terraform apply</code> simultaneously against the same infrastructure, concurrent API modifications will corrupt state and leave cloud resources in an unrecoverable zombie state.</li>"
                                "<li><strong>Plaintext Secret Leakage:</strong> The state file stores all resource attributes in plain text—including database passwords, private SSL keys, and API tokens generated during provisioning. Committing <code>terraform.tfstate</code> to Git exposes secrets to anyone with repository read access.</li>"
                                "</ul>"
                                "<h2>Enterprise Best Practice: Remote Backends and State Locking</h2>"
                                "<p>To collaborate securely, teams must configure a <strong>Remote Backend</strong>. A remote backend stores the state file in a centralized, encrypted cloud storage service accessible to all authorized team members and CI/CD pipelines.</p>"
                                "<p>The industry standard architecture on AWS combines an <strong>Amazon S3 Bucket</strong> (for encrypted state storage and versioning) with an <strong>Amazon DynamoDB Table</strong> (to provide distributed state locking):</p>"
                                "<pre><code>terraform {\n  backend \"s3\" {\n    bucket         = \"myorg-terraform-state-prod\"\n    key            = \"vpc/terraform.tfstate\"\n    region         = \"us-east-1\"\n    encrypt        = true\n    dynamodb_table = \"terraform-state-locks\"\n  }\n}</code></pre>"
                                "<h3>How DynamoDB State Locking Works</h3>"
                                "<p>When an engineer or CI/CD pipeline runs <code>terraform plan</code> or <code>terraform apply</code>, Terraform first reaches out to the specified DynamoDB table and creates a temporary lock record. If a second engineer attempts to run Terraform concurrently, Terraform checks DynamoDB, detects the active lock, and immediately aborts with an error message: <em>'Error: Error acquiring the state lock'</em>. Once the first deployment finishes successfully, Terraform deletes the lock record, ensuring complete transactional safety.</p>"
                            )
                        },
                        {
                            "title": "Modularizing Terraform: Variables, Outputs, and Modules",
                            "desc": "Design reusable, enterprise-grade Terraform modules using input variables, output values, local values, and conditional logic.",
                            "duration": "1h 30m",
                            "image": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Writing DRY (Don't Repeat Yourself) Infrastructure Code</h2>"
                                "<p>As an organization scales, copying and pasting the same 500 lines of VPC, Subnet, and Routing Table HCL code across Development, Staging, and Production repositories creates an unmaintainable nightmare. If a security audit mandates enabling VPC flow logs, engineers must hunt down and modify dozens of duplicated files manually.</p>"
                                "<p>Terraform solves code duplication through <strong>Modules</strong>. A module is simply a self-contained container of multiple resources that are used together. Every Terraform configuration is technically a root module, but you can encapsulate reusable infrastructure patterns into child modules that can be called multiple times with different parameter values.</p>"
                                "<h2>The Three Pillars of Module Design</h2>"
                                "<p>A well-architected Terraform module mirrors the structure of a clean software function, utilizing three distinct variable categories:</p>"
                                "<h3>1. Input Variables (arguments / parameters)</h3>"
                                "<p>Input variables serve as parameters for a module, allowing calling configurations to customize behavior without altering the module's source code. Variables should always enforce strict type validation and descriptive documentation:</p>"
                                "<pre><code>variable \"environment\" {\n  description = \"The deployment environment (dev, staging, prod)\"\n  type        = string\n  default     = \"dev\"\n\n  validation {\n    condition     = contains([\"dev\", \"staging\", \"prod\"], var.environment)\n    error_message = \"Environment must be dev, staging, or prod.\"\n  }\n}\n\nvariable \"instance_count\" {\n  description = \"Number of web servers to launch\"\n  type        = number\n  default     = 2\n}</code></pre>"
                                "<h3>2. Local Values (internal encapsulation)</h3>"
                                "<p><strong>Local values</strong> (<code>locals</code>) assign names to complex expressions or formatting rules internal to the module. Unlike variables, locals cannot be overridden by callers; they keep module code clean and prevent repeating complex string concatenations:</p>"
                                "<pre><code>locals {\n  resource_prefix = \"${var.environment}-us-east-1\"\n  common_tags = {\n    ManagedBy   = \"Terraform\"\n    Environment = var.environment\n    Owner       = \"DevOps-Team\"\n  }\n}</code></pre>"
                                "<h3>3. Output Values (return values)</h3>"
                                "<p>Output values serve as return values for a Terraform module. When a root configuration calls a child module (e.g., a VPC module), it needs to know the dynamically generated IDs of the created subnets to deploy a Kubernetes cluster into them:</p>"
                                "<pre><code>output \"vpc_id\" {\n  description = \"The ID of the provisioned VPC\"\n  value       = aws_vpc.main.id\n}\n\noutput \"private_subnet_ids\" {\n  description = \"List of private subnet IDs for database deployment\"\n  value       = aws_subnet.private[*].id\n}</code></pre>"
                                "<h2>Calling a Child Module</h2>"
                                "<p>Once a module is defined (either locally in a subdirectory or stored remotely in a Git repository or Terraform Registry), you invoke it using a <code>module</code> block:</p>"
                                "<pre><code>module \"network\" {\n  source = \"git::https://github.com/myorg/terraform-aws-vpc.git?ref=v2.1.0\"\n\n  environment    = \"production\"\n  vpc_cidr       = \"10.100.0.0/16\"\n  az_count       = 3\n}</code></pre>"
                                "<p>Notice the use of Git tag versioning (<code>?ref=v2.1.0</code>). Enterprise DevOps teams always pin module versions to prevent unexpected breaking changes when module authors release updates.</p>"
                            )
                        },
                        {
                            "title": "Module 4 Comprehensive Assessment",
                            "desc": "Test your proficiency in Terraform HCL syntax, core workflows, remote state locking, and modular infrastructure design.",
                            "duration": "45m",
                            "type": "quiz",
                            "questions": [
                                {
                                    "type": "mcq",
                                    "text": "Which Terraform command inspects real-world cloud resources, compares them against local HCL files and state, and prints a dry-run diff without modifying any infrastructure?",
                                    "points": 10,
                                    "options": [
                                        "terraform init",
                                        "terraform plan",
                                        "terraform validate",
                                        "terraform apply"
                                    ],
                                    "correct": 1
                                },
                                {
                                    "type": "mcq",
                                    "text": "Why is storing terraform.tfstate on a developer's local hard drive considered a severe security and operational risk in enterprise team environments?",
                                    "points": 10,
                                    "options": [
                                        "Because local state files cannot exceed 1 MB in file size.",
                                        "Because local state files cause Terraform to run slower on Apple MacBook hardware.",
                                        "Because it prevents collaboration, invites race conditions during concurrent deploys, and stores sensitive passwords and API keys in plain text.",
                                        "Because AWS automatically blocks API requests originating from local laptop IP addresses."
                                    ],
                                    "correct": 2
                                },
                                {
                                    "type": "mcq",
                                    "text": "When using an AWS Amazon S3 remote backend for Terraform state, which AWS service is paired with S3 to provide distributed state locking and prevent concurrent execution corruption?",
                                    "points": 10,
                                    "options": [
                                        "Amazon ElastiCache (Redis)",
                                        "Amazon RDS PostgreSQL",
                                        "Amazon DynamoDB",
                                        "Amazon SQS"
                                    ],
                                    "correct": 2
                                },
                                {
                                    "type": "true_false",
                                    "text": "In HCL module design, Local Values (locals) can be overridden by external calling configurations via command-line flags or tfvars files.",
                                    "points": 10,
                                    "correct": False
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Module 5: Monitoring, Logging & Observability",
                    "description": "Implement system-wide observability across microservices using Prometheus metrics collection, PromQL querying, and interactive Grafana dashboards.",
                    "lessons": [
                        {
                            "title": "The Three Pillars of Observability: Metrics, Logs, Traces",
                            "desc": "Transition from basic monitoring to deep system observability, understanding how metrics, structured logs, and distributed traces work together.",
                            "duration": "50m",
                            "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Why Traditional Monitoring Fails in Modern Cloud-Native Systems</h2>"
                                "<p>In monolithic architectures running on static virtual machines, traditional monitoring was straightforward: systems administrators set up ping checks and simple threshold alerts on CPU utilization, memory usage, and disk space. If a server's CPU exceeded 90%, an alert fired.</p>"
                                "<p>In modern cloud-native environments—where applications are decomposed into dozens of microservices running across thousands of ephemeral Kubernetes containers that scale up and down every few minutes—traditional monitoring breaks down completely. A container running at 95% CPU is often healthy and efficiently utilized, whereas a system with low CPU usage might be experiencing total failure due to a database deadlock or network timeout.</p>"
                                "<p>This paradigm shift requires moving from simple monitoring (asking 'Is the system working right now?') to **Observability** (asking 'Why is the system behaving this way, and what is its internal state?').</p>"
                                "<h2>The Three Pillars of Observability</h2>"
                                "<p>Achieving true observability requires instrumenting applications to emit three complementary types of telemetry data:</p>"
                                "<h3>1. Metrics (The 'What')</h3>"
                                "<p>Metrics are numeric values measured over intervals of time (time-series data). They are exceptionally lightweight to store, transmit, and query, making them ideal for real-time dashboarding and automated alerting. Examples include HTTP requests per second, error percentages, database query latency percentiles, and JVM memory utilization.</p>"
                                "<p>Metrics tell you <em>when and where</em> an anomaly is occurring (e.g., 'Payment service error rate spiked from 0.1% to 15% at 14:03 UTC'), but they lack the rich context required to explain exactly why the errors occurred.</p>"
                                "<h3>2. Logs (The 'Why')</h3>"
                                "<p>Logs are immutable, timestamped text records of discrete events emitted by a running application. While legacy systems emitted unstructured plain-text logs, modern DevOps practices mandate **Structured Logging**—emitting log events as JSON objects containing standardized metadata keys (e.g., <code>timestamp</code>, <code>level</code>, <code>service_name</code>, <code>user_id</code>, <code>error_code</code>, <code>stack_trace</code>).</p>"
                                "<p>When a metric alert fires, engineers query structured log aggregation systems (such as ElasticSearch, Grafana Loki, or Splunk) to read the exact error messages and stack traces associated with the failing requests.</p>"
                                "<h3>3. Distributed Traces (The 'Where')</h3>"
                                "<p>In a microservices architecture, a single user click on a frontend web application can trigger a cascading chain of downstream HTTP and gRPC requests across 15 different internal services and databases. If that user request takes 8 seconds to complete, how do you determine which of the 15 services caused the bottleneck?</p>"
                                "<p><strong>Distributed Tracing</strong> solves this by injecting a unique <code>Trace ID</code> into the HTTP headers of the initial incoming request. As the request propagates across microservices, each service passes the Trace ID along and emits timing records called **Spans** (representing work done by that specific service). Tracing visualization platforms (such as Jaeger, Zipkin, or Grafana Tempo) reconstruct the end-to-end request journey as a waterfall chart, revealing precise network latencies and identifying the exact database query or service call causing the slowdown.</p>"
                            )
                        },
                        {
                            "title": "Prometheus Architecture & Pull-Based Metrics",
                            "desc": "Deploy and configure Prometheus monitoring, understanding scraping targets, exporters, metric types, and time-series data storage.",
                            "duration": "1h 15m",
                            "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Why Prometheus is the Cloud-Native Monitoring Standard</h2>"
                                "<p>Originally developed at SoundCloud and graduated from the Cloud Native Computing Foundation (CNCF), <strong>Prometheus</strong> is an open-source monitoring and alerting toolkit built specifically for highly dynamic containerized environments like Kubernetes.</p>"
                                "<h2>Pull-Based Scraping vs. Push-Based Monitoring</h2>"
                                "<p>Most legacy monitoring agents operate on a **Push-based** model: background agents installed on servers periodically push their metrics over the network to a central monitoring server. While this works in static setups, it struggles in Kubernetes where ephemeral pods appear and disappear constantly, creating firewall routing hurdles and risking DDoS attacks against the central server during scaling events.</p>"
                                "<p>Prometheus utilizes a highly efficient **Pull-based (Scraping)** architecture:</p>"
                                "<ul>"
                                "<li>Instrumented applications and exporters expose an HTTP endpoint (by convention, <code>http://&lt;pod-ip&gt;:9090/metrics</code>) returning plain-text metrics.</li>"
                                "<li>The Prometheus Server integrates directly with the Kubernetes API server via **Service Discovery**. It continuously watches the cluster for newly spawned pods and services matching specific label tags.</li>"
                                "<li>At configured intervals (e.g., every 15 seconds), the Prometheus server actively reaches out over the network to pull (scrape) the <code>/metrics</code> endpoint of every discovered target, parsing the metrics and appending them to its internal Time-Series Database (TSDB).</li>"
                                "</ul>"
                                "<p>For batch jobs or short-lived cron scripts that terminate too quickly to be scraped, Prometheus provides an intermediary push proxy called the <strong>Pushgateway</strong>.</p>"
                                "<h2>The Four Prometheus Metric Types</h2>"
                                "<p>Prometheus client libraries offer four core metric primitives to instrument software code:</p>"
                                "<h3>1. Counter</h3>"
                                "<p>A monotonically increasing cumulative metric that can only increase or be reset to zero on restart. Perfect for counting things like total HTTP requests processed, total exceptions thrown, or bytes transmitted: <code>http_requests_total{method=\"POST\", handler=\"/login\"} 10482</code>.</p>"
                                "<h3>2. Gauge</h3>"
                                "<p>A metric representing a single numerical value that can arbitrarily go up and down over time. Used for snapshots of current state, such as current memory utilization, active database connections, or running pod counts: <code>node_memory_active_bytes 4294967296</code>.</p>"
                                "<h3>3. Histogram</h3>"
                                "<p>Samples observations (usually request durations or response sizes) and counts them in configurable numerical buckets, while also tracking the total sum and count of observations. Highly useful for calculating averages and percentiles: <code>http_request_duration_seconds_bucket{le=\"0.1\"} 8421</code>.</p>"
                                "<h3>4. Summary</h3>"
                                "<p>Similar to a Histogram, a Summary samples observations and calculates configurable streaming quantiles (e.g., 50th, 90th, and 99th percentiles) directly on the client application side before exposing them to Prometheus.</p>"
                                "<h2>Exporters: Monitoring Third-Party Software</h2>"
                                "<p>What if you need to monitor software you didn't write and cannot modify—such as a MySQL database, Redis cache, or Linux operating system kernel? You use an <strong>Exporter</strong>. An exporter is a lightweight helper container that runs alongside the third-party software, translates its internal status APIs into Prometheus text format, and exposes a <code>/metrics</code> endpoint for scraping (e.g., <code>node_exporter</code> for Linux system metrics, <code>mysqld_exporter</code> for MySQL).</p>"
                            )
                        },
                        {
                            "title": "Mastering PromQL: Querying Time-Series Data",
                            "desc": "Write advanced PromQL queries to calculate request rates, error percentages, 95th percentile latencies, and resource saturation.",
                            "duration": "1h 30m",
                            "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Unleashing the Power of PromQL</h2>"
                                "<p><strong>PromQL (Prometheus Query Language)</strong> is a functional query language designed specifically for extracting, aggregating, and analyzing time-series data stored in Prometheus. Unlike SQL, which operates on relational tables, PromQL operates on multidimensional time-series vectors.</p>"
                                "<h2>Instant Vectors vs. Range Vectors</h2>"
                                "<p>Understanding PromQL requires grasping the two fundamental vector types:</p>"
                                "<ul>"
                                "<li><strong>Instant Vector:</strong> A set of time-series where each series maps to a single data point measured at the exact current instant in time. Evaluating the query <code>http_requests_total</code> returns an instant vector containing the latest request count for every matching label combination.</li>"
                                "<li><strong>Range Vector:</strong> A set of time-series where each series maps to an array of data points recorded over a specified time duration in the past. You create a range vector by appending a time duration selector in square brackets, such as <code>[5m]</code> (5 minutes) or <code>[1h]</code> (1 hour). Evaluating <code>http_requests_total[5m]</code> returns all raw data points collected for that metric over the last 300 seconds.</li>"
                                "</ul>"
                                "<h2>Essential PromQL Functions and Aggregations</h2>"
                                "<h3>1. Calculating Per-Second Rates: <code>rate()</code> and <code>irate()</code></h3>"
                                "<p>Because Counter metrics constantly increase over days or weeks, looking at the raw counter number (e.g., 50 million requests) is useless for dashboarding. You need to know how fast the counter is increasing <em>right now</em>. The <code>rate()</code> function calculates the per-second average rate of increase of a range vector:</p>"
                                "<pre><code># Calculate average HTTP requests per second over the last 5 minutes\nrate(http_requests_total[5m])</code></pre>"
                                "<p>For highly volatile spikes where <code>rate()</code> smooths out the curve too much, use <code>irate()</code>, which calculates the per-second rate based exclusively on the last two recorded data points in the time window.</p>"
                                "<h3>2. Dimensional Aggregation: <code>sum()</code>, <code>avg()</code>, and <code>by()</code></h3>"
                                "<p>In Kubernetes, a microservice might run across 50 pod replicas, resulting in 50 distinct time-series for <code>http_requests_total</code>. To find the total cluster-wide request volume across all pods, use the <code>sum()</code> aggregation operator paired with the <code>by()</code> clause to group by specific labels:</p>"
                                "<pre><code># Total requests per second grouped by HTTP status code and service name\nsum by (service, status_code) (rate(http_requests_total[5m]))</code></pre>"
                                "<h3>3. Calculating Error Percentages and SLIs</h3>"
                                "<p>To measure Service Level Indicators (SLIs), you frequently need to calculate mathematical ratios between queries. To find the percentage of HTTP requests resulting in 5xx server errors:</p>"
                                "<pre><code># Percentage of HTTP 5xx errors over the last 10 minutes\n(\n  sum(rate(http_requests_total{status_code=~\"5..\"}[10m])) \n  / \n  sum(rate(http_requests_total[10m]))\n) * 100</code></pre>"
                                "<h3>4. Calculating 95th and 99th Percentile Latency: <code>histogram_quantile()</code></h3>"
                                "<p>Averages lie: if 99 requests take 10ms and 1 request hangs for 10 seconds, the average latency is 110ms, hiding the terrible user experience suffered by the outlier. Elite DevOps teams monitor percentiles (P95, P99). Using Prometheus Histograms, you calculate the 95th percentile latency using <code>histogram_quantile()</code>:</p>"
                                "<pre><code># 95th percentile request latency in seconds over the last 5 minutes\nhistogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))</code></pre>"
                            )
                        },
                        {
                            "title": "Grafana Dashboards & Automated Alerting Rules",
                            "desc": "Build interactive, visually stunning Grafana dashboards from Prometheus dataources, and configure intelligent alerting pipelines with Alertmanager.",
                            "duration": "1h 15m",
                            "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
                            "type": "text",
                            "content": (
                                "<h2>Transforming Raw Data into Visual Intelligence with Grafana</h2>"
                                "<p>While Prometheus excels at data collection and PromQL processing, its built-in web interface is intended for rudimentary debugging and query experimentation. For production dashboarding, enterprise monitoring teams pair Prometheus with <strong>Grafana</strong>.</p>"
                                "<p>Grafana is an open-source data visualization and observability platform. It connects seamlessly to multiple data sources—including Prometheus, ElasticSearch, InfluxDB, CloudWatch, and relational databases—allowing engineers to build interactive, multi-panel dashboards that unify metrics, logs, and traces onto a single screen.</p>"
                                "<h2>Dashboard Design Frameworks: The RED and USE Methods</h2>"
                                "<p>When designing dashboards, throwing dozens of random charts onto a page creates visual noise and cognitive overload during an incident. Professional SREs follow two standardized industry design methodologies:</p>"
                                "<h3>1. The RED Method (For Microservices and APIs)</h3>"
                                "<p>Defined by Tom Wilkie, the RED method focuses on request-driven services. Every microservice dashboard should prominently display three charts:</p>"
                                "<ul>"
                                "<li><strong>Rate:</strong> The number of requests your service is serving per second.</li>"
                                "<li><strong>Errors:</strong> The number (or percentage) of those requests that are failing (HTTP 5xx responses).</li>"
                                "<li><strong>Duration:</strong> The amount of time those requests take to complete, visualized as P50, P95, and P99 latency percentiles.</li>"
                                "</ul>"
                                "<h3>2. The USE Method (For Infrastructure and Resources)</h3>"
                                "<p>Defined by Brendan Gregg, the USE method focuses on physical and virtual infrastructure resources (CPUs, RAM, network interfaces, disk volumes). For every resource, monitor:</p>"
                                "<ul>"
                                "<li><strong>Utilization:</strong> The average time that the resource was busy servicing work (e.g., CPU running at 85% capacity).</li>"
                                "<li><strong>Saturation:</strong> The degree to which the resource has extra work which it can't service, often queued (e.g., Linux run queue length or disk I/O wait time).</li>"
                                "<li><strong>Errors:</strong> The count of error events (e.g., network interface packet drops or hard disk read failures).</li>"
                                "</ul>"
                                "<h2>Automated Alerting with Prometheus and Alertmanager</h2>"
                                "<p>Dashboards require human eyes to read; automated alerting ensures engineers are notified instantly when systems degrade. In the Prometheus ecosystem, alerting is split into two distinct steps:</p>"
                                "<h3>Step 1: Defining Alerting Rules in Prometheus</h3>"
                                "<p>You write declarative alerting rules in YAML files loaded into the Prometheus server. An alerting rule continuously evaluates a PromQL expression; if the expression evaluates to true for longer than a specified duration (the <code>for</code> clause), an alert fires:</p>"
                                "<pre><code>groups:\n- name: microservice_alerts\n  rules:\n  - alert: HighErrorRate\n    expr: (sum(rate(http_requests_total{status_code=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))) * 100 > 5\n    for: 2m\n    labels:\n      severity: critical\n    annotations:\n      summary: \"High HTTP error rate detected on {{ $labels.service }}\"\n      description: \"Service {{ $labels.service }} is experiencing a {{ $value }}% 5xx error rate over the last 5 minutes.\"</code></pre>"
                                "<p>The <code>for: 2m</code> clause is critical: it requires the error spike to persist continuously for 2 minutes before triggering, preventing transient network blips from paging engineers at 3:00 AM.</p>"
                                "<h3>Step 2: Routing Notifications via Alertmanager</h3>"
                                "<p>When Prometheus fires an alert, it sends the payload to <strong>Alertmanager</strong>, an independent server process responsible for handling alert deduplication, grouping, silencing, and notification routing. Alertmanager can group 50 individual pod failure alerts from a single node crash into a single summarized notification, routing critical production pages to PagerDuty or OpsGenie while routing informational warnings to a team Slack channel or email list.</p>"
                            )
                        },
                        {
                            "title": "Module 5 Comprehensive Assessment",
                            "desc": "Evaluate your mastery of observability concepts, Prometheus architecture, PromQL syntax, and Grafana dashboard design.",
                            "duration": "30m",
                            "type": "quiz",
                            "questions": [
                                {
                                    "type": "mcq",
                                    "text": "In the RED dashboard design methodology for request-driven microservices, what do the letters R, E, and D stand for?",
                                    "points": 10,
                                    "options": [
                                        "Read, Execute, Delete",
                                        "Rate, Errors, Duration",
                                        "Reliability, Efficiency, Delivery",
                                        "Requests, Exceptions, Database"
                                    ],
                                    "correct": 1
                                },
                                {
                                    "type": "mcq",
                                    "text": "Why does Prometheus utilize a Pull-Based (Scraping) architecture rather than requiring monitoring agents to push metrics directly to the central server?",
                                    "points": 10,
                                    "options": [
                                        "Because push-based monitoring is illegal under European Union data privacy laws.",
                                        "To prevent DDoS attacks against the central server during massive cluster scaling events and to simplify firewall configuration via Kubernetes Service Discovery.",
                                        "Because Kubernetes pods do not have IP addresses.",
                                        "Because pull-based scraping allows Prometheus to run without storing data on disk."
                                    ],
                                    "correct": 1
                                },
                                {
                                    "type": "mcq",
                                    "text": "Which PromQL function should you use to calculate the per-second average rate of increase of a monotonically increasing Counter metric over a specified time duration?",
                                    "points": 10,
                                    "options": [
                                        "sum()",
                                        "rate()",
                                        "histogram_quantile()",
                                        "gauge()"
                                    ],
                                    "correct": 1
                                },
                                {
                                    "type": "true_false",
                                    "text": "When defining an alerting rule in Prometheus, the 'for: 5m' clause ensures that an alert only fires if the anomaly condition persists continuously for at least 5 minutes, preventing transient blips from causing false alarms.",
                                    "points": 10,
                                    "correct": True
                                }
                            ]
                        }
                    ]
                }
            ]

            # 6. Execute Curriculum Seeding
            total_lessons = 0
            total_quizzes = 0

            for mod_idx, mod_data in enumerate(modules_data):
                module = CurriculumNode.objects.create(
                    program=program,
                    title=mod_data["title"],
                    node_type="Module",
                    description=mod_data.get("description", ""),
                    position=mod_idx,
                    is_published=True
                )
                self.stdout.write(f"  + Created Module {mod_idx+1}: {module.title}")

                for lesson_idx, lesson_data in enumerate(mod_data["lessons"]):
                    lesson_type = lesson_data.get("type", "text")
                    duration_str = lesson_data.get("duration", "45m")
                    image_url = lesson_data.get("image", thumbnail_url)

                    lesson = CurriculumNode.objects.create(
                        parent=module,
                        program=program,
                        title=lesson_data["title"],
                        node_type="Lesson",
                        description=lesson_data["desc"],
                        position=lesson_idx,
                        is_published=True,
                        properties={
                            "lesson_type": lesson_type,
                            "duration": duration_str,
                            "thumbnail": image_url,
                            "content": lesson_data.get("content", "") if lesson_type == "text" else ""
                        }
                    )
                    total_lessons += 1

                    if lesson_type == "text":
                        # Create IMAGE block
                        ContentBlock.objects.create(
                            node=lesson,
                            position=0,
                            block_type="IMAGE",
                            data={"url": image_url, "caption": lesson_data["title"]}
                        )
                        # Create RICHTEXT block
                        ContentBlock.objects.create(
                            node=lesson,
                            position=1,
                            block_type="RICHTEXT",
                            data={"html": lesson_data["content"]}
                        )
                    elif lesson_type == "quiz":
                        total_quizzes += 1
                        quiz = Quiz.objects.create(
                            node=lesson,
                            title=lesson_data["title"],
                            description=lesson_data["desc"],
                            pass_threshold=75,
                            is_published=True
                        )
                        for q_idx, q_data in enumerate(lesson_data["questions"]):
                            q_type = q_data["type"]
                            question = Question.objects.create(
                                quiz=quiz,
                                question_type=q_type,
                                text=q_data["text"],
                                points=q_data.get("points", 10),
                                position=q_idx,
                                answer_data={"correct": q_data.get("correct")}
                            )
                            if q_type in ("mcq", "mcq_multi"):
                                for opt_idx, opt_text in enumerate(q_data["options"]):
                                    QuestionOption.objects.create(
                                        question=question,
                                        text=opt_text,
                                        is_correct=(opt_idx == q_data.get("correct")),
                                        position=opt_idx
                                    )

        # 7. Resync Quiz Properties outside or inside atomic, call_command works cleanly
        self.stdout.write("Synchronizing quiz properties in nodes...")
        call_command("resync_quiz_properties", stdout=self.stdout)

        self.stdout.write(self.style.SUCCESS(
            f"✓ Successfully seeded DevOps Engineering Mastery (DEVOPS-401)!\n"
            f"  - Modules: {len(modules_data)}\n"
            f"  - Total Lessons: {total_lessons} (including {total_quizzes} quizzes with comprehensive questions)\n"
            f"  - Rich HTML descriptions and realistic durations added to all nodes!"
        ))
