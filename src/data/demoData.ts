import { StudySession, DailyTask, TopicNote, QuizAttempt, Mistake, QuestionAttemptRecord } from '../types';

export const DEMO_SESSIONS: StudySession[] = [
  {
    id: 'demo-s1',
    date: '2026-08-28', // Today
    subjectId: 'dbms-warehousing',
    topicId: 'db-normalization',
    startTime: '09:00',
    endTime: '10:30',
    durationMinutes: 90,
    description: 'Studied 1NF, 2NF, 3NF and BCNF definitions and solved 15 functional dependency closure questions.',
    importantPoints: 'Armstrong axioms, BCNF requires superkey on LHS, 3NF allows prime attribute on RHS.',
    doubts: 'How to quickly verify dependency preservation in 4-way decompositions without computing all F+ projections.',
    confidence: 4,
    completed: true,
    createdAt: new Date('2026-08-28T10:30:00Z').toISOString(),
  },
  {
    id: 'demo-s2',
    date: '2026-08-28', // Today
    subjectId: 'prob-stats',
    topicId: 'ps-probability-basics',
    startTime: '14:00',
    endTime: '15:00',
    durationMinutes: 60,
    description: 'Bayes Theorem, Total Probability Law, and conditional independence problem solving.',
    importantPoints: 'Remember base rate fallacy; P(A|B) vs P(B|A) relationship via prior odds.',
    doubts: 'None currently.',
    confidence: 5,
    completed: true,
    createdAt: new Date('2026-08-28T15:00:00Z').toISOString(),
  },
  {
    id: 'demo-s3',
    date: '2026-08-27',
    subjectId: 'linear-algebra',
    topicId: 'la-eigen-decomp',
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    description: 'Eigenvalues and Eigenvectors of symmetric matrices, spectral theorem, algebraic vs geometric multiplicity.',
    importantPoints: 'Real symmetric matrices always have real eigenvalues and orthogonal eigenvectors.',
    doubts: 'Defective matrix conditions and Jordan normal form implications.',
    confidence: 4,
    completed: true,
    createdAt: new Date('2026-08-27T12:00:00Z').toISOString(),
  },
  {
    id: 'demo-s4',
    date: '2026-08-26',
    subjectId: 'machine-learning',
    topicId: 'ml-supervised-classification',
    startTime: '16:00',
    endTime: '17:30',
    durationMinutes: 90,
    description: 'Logistic regression cost function derivation, cross-entropy loss, decision boundaries and SVM margin.',
    importantPoints: 'SVM maximize 2/||w|| subject to y_i(w.x + b) >= 1.',
    doubts: 'Kernel trick mathematical proof for infinite dimensional RBF kernel.',
    confidence: 3,
    completed: true,
    createdAt: new Date('2026-08-26T17:30:00Z').toISOString(),
  },
  {
    id: 'demo-s5',
    date: '2026-08-25',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    startTime: '11:00',
    endTime: '12:15',
    durationMinutes: 75,
    description: 'Python memory model, mutable vs immutable types, list comprehensions, time complexity of dict lookups.',
    importantPoints: 'Average O(1) for hash map vs worst case O(N) under collision clustering.',
    doubts: 'None.',
    confidence: 5,
    completed: true,
    createdAt: new Date('2026-08-25T12:15:00Z').toISOString(),
  },
  {
    id: 'demo-s6',
    date: '2026-08-24',
    subjectId: 'calculus-optimization',
    topicId: 'co-optimization',
    startTime: '09:30',
    endTime: '11:00',
    durationMinutes: 90,
    description: 'Convexity definitions, Hessian positive semi-definiteness, gradient descent step size bounds.',
    importantPoints: 'If Hessian is positive definite everywhere, local minimum is unique global minimum.',
    doubts: 'Non-smooth convex optimization subgradient calculus.',
    confidence: 3,
    completed: true,
    createdAt: new Date('2026-08-24T11:00:00Z').toISOString(),
  },
  {
    id: 'demo-s7',
    date: '2026-08-23',
    subjectId: 'artificial-intelligence',
    topicId: 'ai-search-algorithms',
    startTime: '15:00',
    endTime: '16:30',
    durationMinutes: 90,
    description: 'A* search algorithm, proving admissibility implies optimality in tree search, consistency in graph search.',
    importantPoints: 'Consistent heuristic implies h(A) <= c(A,P,B) + h(B) (triangle inequality).',
    doubts: 'Memory footprint scaling in IDA*.',
    confidence: 4,
    completed: true,
    createdAt: new Date('2026-08-23T16:30:00Z').toISOString(),
  },
];

export const DEMO_TASKS: DailyTask[] = [
  {
    id: 'task-1',
    date: '2026-08-28',
    title: 'Study DBMS Normalization & solve 10 questions',
    completed: true,
    subjectId: 'dbms-warehousing',
    topicId: 'db-normalization',
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    date: '2026-08-28',
    title: 'Revise Probability distributions and Bayes Theorem',
    completed: true,
    subjectId: 'prob-stats',
    topicId: 'ps-probability-basics',
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    date: '2026-08-28',
    title: 'Attempt 10-question quiz on Linear Algebra Eigenvalues',
    completed: false,
    subjectId: 'linear-algebra',
    topicId: 'la-eigen-decomp',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    date: '2026-08-28',
    title: 'Write important formulas for PCA & SVD in Digital Notes',
    completed: false,
    subjectId: 'machine-learning',
    topicId: 'ml-unsupervised',
    priority: 'low',
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_NOTES: Record<string, TopicNote> = {
  'db-normalization': {
    topicId: 'db-normalization',
    importantConcepts: `• **1NF**: Atomic attribute values only (no repeating groups).
• **2NF**: In 1NF and NO non-prime attribute is partially dependent on any candidate key.
• **3NF**: In 2NF and for every X -> Y, either X is superkey OR Y is a prime attribute.
• **BCNF**: For every non-trivial X -> Y, X MUST be a superkey.
• **Lossless Join**: R1 ∩ R2 -> R1 or R1 ∩ R2 -> R2 in F+.
• **Dependency Preserving**: (F1 ∪ F2)+ = F+.`,
    importantFormulas: `• Total possible superkeys = $2^{n - |K|}$ for a single candidate key $K$ of size $|K|$ in an $n$-attribute relation.
• Closure test: $X^{(0)} = X$, $X^{(i+1)} = X^{(i)} \\cup \\{Y \\mid W \\rightarrow Y \\in F, W \\subseteq X^{(i)}\\}$.`,
    examples: `**GATE DA 2024 Example:**
$R(A, B, C, D)$, $F = \\{AB \\rightarrow C, C \\rightarrow D, D \\rightarrow A\\}$.
Candidate keys: $AB, BC, BD$.
All attributes $\{A,B,C,D\}$ are prime!
Thus $R$ is in 3NF (since $D$ is prime in $C \\rightarrow D$ and $A$ is prime in $D \\rightarrow A$), but NOT BCNF because $C$ and $D$ are not superkeys.`,
    myUnderstanding: `If all attributes in a relation are prime, the relation is GUARANTEED to be in 3NF! However, it might fail BCNF if any LHS is not a superkey.`,
    doubts: `How to quickly test BCNF decomposition trees without redundant FD projections.`,
    mistakes: `Confused 2NF with 3NF when prime attribute was on LHS instead of RHS. Always check if LHS is a proper subset of candidate key for 2NF violations.`,
    lastUpdated: '2026-08-28T10:35:00Z',
  },
  'la-eigen-decomp': {
    topicId: 'la-eigen-decomp',
    importantConcepts: `• Characteristic equation: $\\det(A - \\lambda I) = 0$.
• Trace of $A$ = $\\sum \\lambda_i$.
• Determinant of $A$ = $\\prod \\lambda_i$.
• For symmetric real matrix, eigenvalues are strictly real, eigenvectors for distinct eigenvalues are orthogonal.`,
    importantFormulas: `• If $A v = \\lambda v$, then $A^k v = \\lambda^k v$.
• $A^{-1} v = \\frac{1}{\\lambda} v$ (if $\\lambda \\neq 0$).
• $f(A) v = f(\\lambda) v$.`,
    examples: `Matrix $A = \\begin{bmatrix} 4 & 1 \\\\ 2 & 3 \\end{bmatrix}$.
Trace $= 7$, $\\det = 12 - 2 = 10$.
$\\lambda^2 - 7\\lambda + 10 = 0 \\implies \\lambda = 2, 5$.`,
    myUnderstanding: `Diagonalization requires $n$ linearly independent eigenvectors ($AM = GM$ for all eigenvalues).`,
    doubts: `Proof of Spectral Decomposition theorem $A = Q \\Lambda Q^T$.`,
    mistakes: `Forgot that determinant equals product of eigenvalues and computed polynomial by long expansion.`,
    lastUpdated: '2026-08-27T12:05:00Z',
  },
};

export const DEMO_MISTAKES: Mistake[] = [
  {
    id: 'mst-1',
    subjectId: 'dbms-warehousing',
    topicId: 'db-normalization',
    questionId: 'q-db-norm-7',
    questionText: 'Consider R(W, X, Y, Z) with F = { W -> X, X -> Y, Y -> Z, Z -> W }. If decomposed into R1(W, X), R2(X, Y), R3(Y, Z), is the dependency Z -> W preserved directly?',
    options: [
      'Yes, directly in R3',
      'Yes, because (F1 ∪ F2 ∪ F3)+ logically implies Z -> W',
      'No, dependency is lost completely',
      'No, because Z and W are not together in any decomposed relation and cannot be inferred'
    ],
    selectedAnswer: 'Yes, directly in R3',
    correctAnswer: 'No, dependency is lost completely',
    explanation: 'From F1={W->X}, F2={X->Y}, F3={Y->Z}, computing Z+ only yields {Z}. Thus Z->W cannot be inferred from the decomposed relations without the original FD.',
    concept: 'Dependency Preservation Testing',
    date: '2026-08-28',
    status: 'Reviewed',
    userNote: 'Need to compute closure of LHS strictly using the projected FDs F_i, not the original F!',
  },
  {
    id: 'mst-2',
    subjectId: 'machine-learning',
    topicId: 'ml-unsupervised',
    questionId: 'q-ml-pca-1',
    questionText: 'In Principal Component Analysis (PCA), the principal components are eigenvectors of which matrix computed from zero-centered data?',
    options: ['Sample Covariance Matrix', 'Hessian Matrix', 'Confusion Matrix', 'Transition Probability Matrix'],
    selectedAnswer: 'Hessian Matrix',
    correctAnswer: 'Sample Covariance Matrix',
    explanation: 'PCA maximizes variance along orthogonal projections, which mathematically yields the eigenvectors of the empirical covariance matrix X^T X / (N - 1).',
    concept: 'PCA Formulation',
    date: '2026-08-26',
    status: 'Understood',
    userNote: 'Hessian is for optimization curvature, not covariance directions.',
  },
];
