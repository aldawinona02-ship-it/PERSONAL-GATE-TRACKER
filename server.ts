import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

function generateFallbackAssistantResponse(query: string, topic: string, subject: string): string {
  return `### 📘 Concept Guide: ${topic} (${subject})

**Question Analyzed**: *${query}*

#### 1. Fundamental Principle
In **GATE Data Science & Artificial Intelligence (DA)**, mastery of ${topic} relies on understanding the core mathematical guarantees, algebraic structures, and algorithmic complexities.

#### 2. Key Derivation / Step-by-Step Breakdown
- **Formal Definition**: Review the canonical properties and constraints governing ${topic}.
- **Mathematical Form**: Ensure you can express the problem as optimization ($$\\min L(\\theta)$$), matrix transformation ($$Ax = \\lambda x$$ or $$U \\Sigma V^T$$), or conditional probability distribution ($$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$).
- **Boundary Conditions**: Pay special attention to singularity, non-negativity, invertibility, and convergence rates.

#### 3. Standard GATE DA Tip
> 💡 *Always write down the known dimensions and check whether independence or orthogonality conditions are satisfied before applying formulas!*`;
}

function generateFallbackQuestions(subject: string, topic: string, count: number, difficulty: string): any[] {
  const normTopic = (topic || '').toLowerCase();
  const normSubject = (subject || '').toLowerCase();

  const isSearchAI = normTopic.includes('search') || normTopic.includes('problem solving') || normTopic.includes('ai-search');
  const isLogic = normTopic.includes('logic') || normTopic.includes('knowledge') || normTopic.includes('fol');
  const isUncertainty = normTopic.includes('uncertainty') || normTopic.includes('bayes') || normTopic.includes('mdp');
  const isProbStats = normSubject.includes('prob') || normTopic.includes('prob') || normTopic.includes('random') || normTopic.includes('distribution') || normTopic.includes('stat');
  const isLinAlg = normSubject.includes('linear') || normTopic.includes('matrix') || normTopic.includes('eigen') || normTopic.includes('vector') || normTopic.includes('svd');
  const isML = normSubject.includes('machine') || normTopic.includes('regression') || normTopic.includes('classification') || normTopic.includes('cluster') || normTopic.includes('pca');
  const isDBMS = normSubject.includes('db') || normTopic.includes('sql') || normTopic.includes('normal') || normTopic.includes('transaction') || normTopic.includes('relational');
  const isDSA = normSubject.includes('program') || normTopic.includes('python') || normTopic.includes('data structure') || normTopic.includes('algorithm');
  const isCalc = normSubject.includes('calc') || normTopic.includes('gradient') || normTopic.includes('optimization') || normTopic.includes('convex');

  let topicBank: any[] = [];

  if (isSearchAI) {
    topicBank = [
      {
        question: 'Which condition guarantees that A* graph search (with a closed list) will ALWAYS find the optimal path to the goal without reopening closed nodes?',
        options: [
          'The heuristic h(n) must be consistent (satisfy triangle inequality: h(n) <= c(n, a, n\') + h(n\'))',
          'The heuristic h(n) must be strictly admissible, even if inconsistent',
          'The step costs must all be strictly non-negative integers',
          'The branching factor b must be finite',
        ],
        correctAnswer: 'A',
        explanation: 'For graph search, consistency (monotonicity) guarantees that the first time any state is expanded, the path found to it is already optimal. Thus, closed nodes never need to be reopened.',
        concept: 'A* Graph Search & Consistency',
        difficulty: 'GATE Level',
      },
      {
        question: 'In state-space search with uniform step cost c, branching factor b, and optimal solution at depth d, what are the worst-case space complexities of Breadth-First Search (BFS) and Iterative Deepening Search (IDS)?',
        options: [
          'BFS: O(b^d), IDS: O(b * d)',
          'BFS: O(b * d), IDS: O(b^d)',
          'BFS: O(b^d), IDS: O(b^d)',
          'BFS: O(d), IDS: O(b)',
        ],
        correctAnswer: 'A',
        explanation: 'BFS keeps all frontier nodes in memory (O(b^d)), whereas IDS combines the optimality of BFS with the linear space complexity of DFS (O(b * d)).',
        concept: 'Search Space Complexity Comparison',
        difficulty: 'Medium',
      },
      {
        question: 'In a game-tree search using the Minimax algorithm with Alpha-Beta pruning, an α-cutoff (pruning) occurs at a MIN node when which condition holds?',
        options: [
          'The current node value is less than or equal to alpha (β <= α)',
          'alpha > beta + 1',
          'The current node value is greater than beta',
          'alpha reaches 0',
        ],
        correctAnswer: 'A',
        explanation: 'Alpha is the best value MAX can guarantee. If at a MIN node, beta drops below or equals alpha (β <= α), MAX will never choose the branch leading to this MIN node, so remaining children are pruned.',
        concept: 'Alpha-Beta Pruning Cutoff Rule',
        difficulty: 'Hard',
      },
      {
        question: 'If h1(n) and h2(n) are both admissible heuristics for a goal-directed search problem, which of the following combined heuristic functions is strictly admissible and dominates both h1 and h2?',
        options: [
          'h(n) = max(h1(n), h2(n))',
          'h(n) = min(h1(n), h2(n))',
          'h(n) = h1(n) + h2(n)',
          'h(n) = (h1(n) * h2(n)) / 2',
        ],
        correctAnswer: 'A',
        explanation: 'Because both h1(n) <= h*(n) and h2(n) <= h*(n), max(h1(n), h2(n)) <= h*(n) remains admissible. Since max(h1, h2) >= h1 and max(h1, h2) >= h2, it dominates both and expands fewer or equal nodes.',
        concept: 'Heuristic Dominance and Combination',
        difficulty: 'GATE Level',
      },
      {
        question: 'In Simulated Annealing search, when the temperature T approaches 0 (T -> 0), the algorithm\'s behavior converges to:',
        options: [
          'Standard Greedy Hill Climbing',
          'Uniform Random Walk',
          'Breadth First Search',
          'Uniform Cost Search',
        ],
        correctAnswer: 'A',
        explanation: 'The probability of accepting a worse move is P = exp(ΔE / T). As T -> 0, P approaches 0 for any negative ΔE, meaning only strictly improving moves are accepted, identical to greedy hill climbing.',
        concept: 'Simulated Annealing Temperature Limits',
        difficulty: 'Medium',
      },
      {
        question: 'In Constraint Satisfaction Problems (CSP), the Minimum Remaining Values (MRV) heuristic is also known as:',
        options: [
          'Most Constrained Variable (Fail-First) heuristic',
          'Least Constraining Value heuristic',
          'Degree heuristic for tie breaking',
          'Arc consistency pruning',
        ],
        correctAnswer: 'A',
        explanation: 'MRV chooses the variable with the fewest legal values remaining. By picking the most constrained variable first, if a failure is inevitable, it detects it immediately (fail-first principle).',
        concept: 'CSP Variable Ordering Heuristics',
        difficulty: 'Medium',
      },
      {
        question: 'Uniform Cost Search (UCS) on a graph with positive step costs is guaranteed to find an optimal solution because it expands nodes in order of:',
        options: [
          'Path cost g(n) from start node',
          'Heuristic value h(n)',
          'Evaluation function f(n) = g(n) + 2h(n)',
          'Depth in the search tree',
        ],
        correctAnswer: 'A',
        explanation: 'UCS is Dijkstra\'s algorithm applied to implicit search graphs. It always pops the node with minimum cumulative cost g(n) from the priority queue.',
        concept: 'Uniform Cost Search Optimality',
        difficulty: 'Easy',
      },
      {
        question: 'In Iterative Deepening A* (IDA*), how is the threshold for the next iteration determined when the search fails to find a goal within the current threshold?',
        options: [
          'It is set to the minimum f-cost among all nodes that exceeded the current threshold',
          'It is incremented by a fixed constant of 1.0',
          'It is set to the maximum depth of the previous iteration',
          'It is doubled on every iteration',
        ],
        correctAnswer: 'A',
        explanation: 'IDA* uses f-cost cutoffs. When an iteration terminates without finding a goal, the new threshold is set to the smallest f-cost that exceeded the previous threshold.',
        concept: 'IDA* Threshold Setting',
        difficulty: 'Hard',
      },
    ];
  } else if (isLogic) {
    topicBank = [
      {
        question: 'Which of the following propositional logic formulas is a TAUTOLOGY?',
        options: [
          '(P -> Q) v (Q -> P)',
          '(P v Q) -> (P ^ Q)',
          '(P -> Q) ^ (Q -> P)',
          'P -> (Q ^ ~Q)',
        ],
        correctAnswer: 'A',
        explanation: '(P -> Q) v (Q -> P) ≡ (~P v Q) v (~Q v P) ≡ (~P v P) v (~Q v Q) ≡ True v True ≡ True.',
        concept: 'Propositional Tautologies',
        difficulty: 'GATE Level',
      },
      {
        question: 'In First-Order Logic (FOL), what is the correct negation of "∀x (P(x) -> Q(x))"?',
        options: [
          '∃x (P(x) ^ ~Q(x))',
          '∀x (P(x) ^ ~Q(x))',
          '∃x (~P(x) v Q(x))',
          '~∃x (P(x) -> Q(x))',
        ],
        correctAnswer: 'A',
        explanation: '~∀x (P(x) -> Q(x)) ≡ ∃x ~(~P(x) v Q(x)) ≡ ∃x (P(x) ^ ~Q(x)).',
        concept: 'FOL Quantifier Negation',
        difficulty: 'Medium',
      },
      {
        question: 'In resolution refutation, to prove KB ⊨ α, what statement do we show is UNSATISFIABLE?',
        options: [
          'KB ∪ {~α}',
          'KB ∪ {α}',
          'KB -> α',
          '~KB ∪ {α}',
        ],
        correctAnswer: 'A',
        explanation: 'Resolution refutation adds the negated goal ~α to the CNF clauses of KB and applies the resolution rule until the empty clause (contradiction) is derived.',
        concept: 'Resolution Refutation',
        difficulty: 'Hard',
      },
      {
        question: 'A Horn clause is a clause (disjunction of literals) with at most how many positive literals?',
        options: [
          'At most one positive literal',
          'Exactly two positive literals',
          'No negative literals',
          'Any number of positive literals',
        ],
        correctAnswer: 'A',
        explanation: 'A Horn clause contains at most one positive (unnegated) literal. Definite clauses contain exactly one positive literal, while goal clauses contain zero positive literals.',
        concept: 'Horn Clauses & Definite Clauses',
        difficulty: 'Medium',
      },
    ];
  } else if (isUncertainty) {
    topicBank = [
      {
        question: 'In a Bayesian Network, what constitutes the Markov Blanket of a node X?',
        options: [
          'X\'s parents, X\'s children, and other parents of X\'s children (co-parents)',
          'Only X\'s direct parents and children',
          'All ancestor nodes and descendant nodes of X',
          'All nodes that share a common directed path with X',
        ],
        correctAnswer: 'A',
        explanation: 'Conditioned on its Markov blanket (parents, children, and spouses/co-parents), node X is conditionally independent of all other nodes in the network.',
        concept: 'Markov Blanket Definition',
        difficulty: 'GATE Level',
      },
      {
        question: 'In Markov Decision Processes (MDPs), the Bellman Optimality Equation for the value function V*(s) is:',
        options: [
          'V*(s) = max_a [ R(s, a) + γ ∑_s\' P(s\'|s, a) V*(s\') ]',
          'V*(s) = ∑_a π(a|s) [ R(s, a) + γ V*(s) ]',
          'V*(s) = max_a [ R(s, a) / (1 - γ) ]',
          'V*(s) = R(s) + max_a [ γ ∑_s\' P(s\'|s, a) ]',
        ],
        correctAnswer: 'A',
        explanation: 'The optimal value of state s is the maximum over all actions of the immediate reward plus the discounted expected value of the next state.',
        concept: 'Bellman Optimality Equation',
        difficulty: 'Hard',
      },
      {
        question: 'In Bayesian Networks, two nodes X and Y are d-separated by evidence Z along a path if the path contains a collider (v-structure A -> C <- B) where:',
        options: [
          'Neither C nor any descendant of C is in Z',
          'C or a descendant of C is in Z',
          'C is in Z',
          'All ancestors of C are in Z',
        ],
        correctAnswer: 'A',
        explanation: 'A collider blocks the path (causes conditional independence) as long as neither the collider node nor any of its descendants has been observed (is in Z).',
        concept: 'd-Separation & Collider Inactive Rule',
        difficulty: 'GATE Level',
      },
    ];
  } else if (isML) {
    topicBank = [
      {
        question: 'In Logistic Regression with binary labels y in {0, 1}, what is the log-loss (cross-entropy) loss function for N samples?',
        options: [
          '- (1/N) ∑ [ y_i * log(p_i) + (1 - y_i) * log(1 - p_i) ]',
          '(1/N) ∑ (y_i - p_i)^2',
          '- (1/N) ∑ [ log(p_i) + log(1 - p_i) ]',
          '(1/N) ∑ |y_i - p_i|',
        ],
        correctAnswer: 'A',
        explanation: 'Binary Cross-Entropy (Log-Loss) measures the negative log-likelihood: - (1/N) ∑ [ y_i log(p_i) + (1 - y_i) log(1 - p_i) ].',
        concept: 'Log-Loss in Classification',
        difficulty: 'GATE Level',
      },
      {
        question: 'In Ridge Regression (L2 regularization), the analytical closed-form solution for the weight vector w with regularization parameter λ is:',
        options: [
          'w = (X^T X + λ I)^(-1) X^T y',
          'w = (X^T X)^(-1) X^T y + λ',
          'w = (X X^T + λ I)^(-1) y',
          'w = X^T (X X^T + λ I)^(-1) y',
        ],
        correctAnswer: 'A',
        explanation: 'Minimizing ||Xw - y||^2 + λ||w||^2 gives 2 X^T(Xw - y) + 2λw = 0 => (X^T X + λ I)w = X^T y => w = (X^T X + λ I)^(-1) X^T y.',
        concept: 'Ridge Regression Normal Equations',
        difficulty: 'GATE Level',
      },
      {
        question: 'In Support Vector Machines (SVM), which vectors strictly determine the optimal separating hyperplane and maximum margin?',
        options: [
          'The data points lying on the margin boundary or misclassified (Support Vectors)',
          'All training data points equally',
          'Only the class centroids',
          'The outliers furthest from the decision boundary',
        ],
        correctAnswer: 'A',
        explanation: 'The SVM dual problem assigns non-zero Lagrange multipliers (α_i > 0) ONLY to the support vectors lying on the margin boundaries or violating margins.',
        concept: 'SVM Support Vectors and Sparsity',
        difficulty: 'Medium',
      },
      {
        question: 'In k-Means clustering, the algorithm is guaranteed to converge to:',
        options: [
          'A local minimum (or saddle point) of the Within-Cluster Sum of Squares (WCSS)',
          'The global minimum of WCSS',
          'A strictly convex cluster partition',
          'Equal cluster sizes',
        ],
        correctAnswer: 'A',
        explanation: 'Because both the assignment step and centroid update step monotonically decrease or preserve the WCSS objective, k-Means is guaranteed to converge to a local minimum.',
        concept: 'k-Means Convergence Properties',
        difficulty: 'Medium',
      },
    ];
  } else if (isLinAlg) {
    topicBank = [
      {
        question: 'Let A be an n x n real symmetric matrix. Which of the following statements is ALWAYS TRUE?',
        options: [
          'All eigenvalues of A are real, and eigenvectors corresponding to distinct eigenvalues are orthogonal.',
          'All eigenvalues of A are strictly positive.',
          'Matrix A cannot be diagonalized.',
          'The determinant of A must equal the trace of A.',
        ],
        correctAnswer: 'A',
        explanation: 'By the Spectral Theorem, any real symmetric matrix has all real eigenvalues and can be orthogonally diagonalized (A = Q Λ Q^T).',
        concept: 'Spectral Theorem for Real Symmetric Matrices',
        difficulty: 'GATE Level',
      },
      {
        question: 'For an m x n matrix A with rank r, what is the dimension of the null space Null(A)?',
        options: [
          'n - r',
          'm - r',
          'r',
          'm + n - r',
        ],
        correctAnswer: 'A',
        explanation: 'By the Rank-Nullity Theorem: Rank(A) + Nullity(A) = n (number of columns). Thus Nullity(A) = n - r.',
        concept: 'Rank-Nullity Theorem',
        difficulty: 'Medium',
      },
      {
        question: 'If λ is an eigenvalue of an invertible matrix A with eigenvector v, what is an eigenvalue and eigenvector of A^(-1)?',
        options: [
          '1/λ with eigenvector v',
          '-λ with eigenvector v',
          'λ^2 with eigenvector v',
          '1/λ with eigenvector A*v',
        ],
        correctAnswer: 'A',
        explanation: 'Av = λv. Multiplying by A^(-1): v = λ A^(-1)v => A^(-1)v = (1/λ)v.',
        concept: 'Inverse Matrix Eigenvalues',
        difficulty: 'Easy',
      },
    ];
  } else if (isProbStats) {
    topicBank = [
      {
        question: 'For two random variables X and Y, which condition guarantees that Var(X + Y) = Var(X) + Var(Y)?',
        options: [
          'Cov(X, Y) = 0 (Uncorrelated)',
          'E[X] = E[Y] = 0',
          'X and Y follow normal distributions',
          'Var(X) = Var(Y)',
        ],
        correctAnswer: 'A',
        explanation: 'Var(X + Y) = Var(X) + Var(Y) + 2 Cov(X, Y). If Cov(X, Y) = 0 (uncorrelated or independent), Var(X + Y) = Var(X) + Var(Y).',
        concept: 'Variance of Sum of Random Variables',
        difficulty: 'GATE Level',
      },
      {
        question: 'If a random variable X follows a Poisson distribution with parameter λ, what are the mean E[X] and variance Var(X)?',
        options: [
          'E[X] = λ, Var(X) = λ',
          'E[X] = λ, Var(X) = λ^2',
          'E[X] = 1/λ, Var(X) = 1/λ^2',
          'E[X] = λ, Var(X) = sqrt(λ)',
        ],
        correctAnswer: 'A',
        explanation: 'A unique characteristic of the Poisson distribution is that its mean and variance are both identically equal to the rate parameter λ.',
        concept: 'Poisson Distribution Moments',
        difficulty: 'Easy',
      },
      {
        question: 'By the Central Limit Theorem (CLT), as sample size n becomes large, the distribution of the sample mean X̄ converges to:',
        options: [
          'Normal distribution N(μ, σ^2 / n) regardless of the population distribution (provided finite variance)',
          'Standard Cauchy distribution',
          'Uniform distribution U(0, 1)',
          'Exact distribution of the parent population',
        ],
        correctAnswer: 'A',
        explanation: 'The CLT states that the standardized sample mean converges in distribution to standard normal N(0, 1), so X̄ ~ N(μ, σ^2/n).',
        concept: 'Central Limit Theorem',
        difficulty: 'Medium',
      },
    ];
  } else {
    // General high-yield GATE DA bank
    topicBank = [
      {
        question: `In GATE DA syllabus for ${topic} (${subject}), which mathematical property is essential for optimization and convergence?`,
        options: [
          'Lipschitz continuity of gradients and convexity of the objective function',
          'Discontinuity of the activation functions',
          'Zero determinant of the Hessian matrix everywhere',
          'Infinite variance of empirical samples',
        ],
        correctAnswer: 'A',
        explanation: `In ${topic}, standard convergence guarantees for first-order gradient methods rely on Lipschitz continuous gradients and convexity.`,
        concept: `${topic} Analytical Properties`,
        difficulty: difficulty || 'Medium',
      },
      {
        question: `When analyzing algorithm performance and complexity in ${topic}, what is the primary criterion for optimal time-space trade-offs?`,
        options: [
          'Bounding recursive depth and avoiding duplicate state evaluations with memoization/dynamic tables',
          'Increasing cache misses intentionally',
          'Evaluating all redundant leaf branches in brute force',
          'Replacing matrix operations with string concatenation',
        ],
        correctAnswer: 'A',
        explanation: `Efficient computation in ${topic} requires bounding state-space explosion through caching, pruning, and optimal data structure representations.`,
        concept: `${topic} Algorithmic Optimization`,
        difficulty: difficulty || 'Medium',
      },
      {
        question: `For statistical inference and model evaluation in ${topic}, what does a low p-value (p < 0.05) indicate?`,
        options: [
          'Strong evidence against the null hypothesis, rejecting H0 in favor of the alternative hypothesis',
          'That the null hypothesis is proven with 95% probability',
          'That the experiment must be discarded due to high variance',
          'That Type II error is guaranteed to be zero',
        ],
        correctAnswer: 'A',
        explanation: 'A p-value is the probability of obtaining test results at least as extreme as the observed results under the assumption that the null hypothesis is true. A small p-value indicates data is unlikely under H0.',
        concept: 'Hypothesis Testing & p-values',
        difficulty: 'Medium',
      },
    ];
  }

  // Ensure we provide at least `count` distinct questions by duplicating or slicing appropriately
  let result = [...topicBank];
  while (result.length < count) {
    const nextIdx = result.length + 1;
    result.push({
      question: `[Advanced Application ${nextIdx}] In the study of ${topic} (${subject}), consider evaluating edge cases and boundary conditions. Which of the following is correct?`,
      options: [
        `Property ${nextIdx}: Invariant relations hold under linear affine transformations and preserved subspaces.`,
        `Property ${nextIdx}: The computational cost grows unbounded even for constant size inputs.`,
        `Property ${nextIdx}: Determinants must be negative for all symmetric positive definite matrices.`,
        `Property ${nextIdx}: Gradient descent diverged due to non-zero bias without learning rates.`,
      ],
      correctAnswer: 'A',
      explanation: `Conceptual analysis for ${topic}: Linear transformations preserve subspace invariants and maintain orthogonal projections.`,
      concept: `${topic} Boundary Analysis`,
      difficulty: difficulty || 'Medium',
    });
  }

  return result.slice(0, count);
}

function generateFallbackNotes(subject: string, topic: string): any {
  return {
    importantConcepts: `• Definition and fundamental axioms of ${topic}.\n• Key theorems, closure properties, and optimality conditions.\n• Lossless decomposition and dependency preservation guarantees where applicable.`,
    importantFormulas: `• Primary Equation: f(x) = argmin L(w, b) + λ||w||²\n• Expected Value: E[g(X)] = ∑ g(x)p(x) or ∫ g(x)f(x)dx\n• Matrix Invariant: Trace(A) = ∑ λ_i and Det(A) = ∏ λ_i`,
    examples: `Example 1: Given a standard 2x2 problem in ${topic}, compute the step response and verify boundary conditions.\nExample 2: Verify whether functional dependencies F satisfy minimal cover.`,
    myUnderstanding: `Focus on visual geometric intuition (hyperplanes, eigenvectors) and algebraic invariants. Avoid rote memorization of formulas without understanding their underlying assumptions.`,
    doubts: `Verify convergence criteria when learning rates do not satisfy the Robbins-Monro conditions.`,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasApiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // ==========================================
  // API 1: AI Study Assistant (Dual Endpoint)
  // ==========================================
  const handleStudyAssistant = async (req: express.Request, res: express.Response) => {
    try {
      const {
        query,
        message,
        topicName,
        topic,
        subjectName,
        subject,
        conversationHistory = [],
        userContext = {},
      } = req.body;

      const userQuery = (query || message || "").trim();
      const currentTopic = topicName || topic || "General GATE DA";
      const currentSubject = subjectName || subject || "GATE DA Syllabus";

      if (!userQuery) {
        return res.status(400).json({ error: "Missing query or message" });
      }

      const ai = getAIClient();
      if (!ai) {
        // High quality offline explanation when key is not yet configured
        const fallbackReply = generateFallbackAssistantResponse(userQuery, currentTopic, currentSubject);
        return res.json({
          answer: fallbackReply,
          reply: fallbackReply,
          source: "offline-fallback",
        });
      }

      const systemInstruction = `You are the master AI Study Mentor & Professor for a student preparing for the GATE Data Science & Artificial Intelligence (DA) examination.
Student's Context:
- Subject Focus: ${currentSubject}
- Topic Focus: ${currentTopic}
- Exam Target: ${userContext.examName || "GATE 2028 DA"}
- Days to Exam: ${userContext.daysLeft ?? "Target 2028"}
- Syllabus Progress: ${userContext.overallProgress ?? 0}%

Your Capabilities & Instructions:
1. Provide mathematically rigorous, clear, and step-by-step explanations formatted in clean Markdown.
2. For probability & statistics: include standard distribution parameters, expectation, variance, and sample problems.
3. For linear algebra: explain rank, eigenvalues/eigenvectors, SVD, PCA, matrix decompositions with concrete matrices.
4. For calculus & optimization: show gradient descent steps, Lagrange multipliers, convexity conditions.
5. For DBMS & Warehousing: explain normal forms (1NF, 2NF, 3NF, BCNF) with lossless & dependency proofs, indexing, and SQL queries.
6. For Machine Learning & AI: derive loss functions, decision boundaries, A* heuristic admissibility & consistency, SVM primal/dual formulations.
7. Be encouraging, precise, and directly address any misconceptions.`;

      const contents: any[] = [];
      if (Array.isArray(conversationHistory)) {
        for (const turn of conversationHistory.slice(-8)) {
          if (turn.text && turn.sender) {
            contents.push({
              role: turn.sender === "user" ? "user" : "model",
              parts: [{ text: turn.text }],
            });
          }
        }
      }
      contents.push({
        role: "user",
        parts: [
          {
            text: `[Topic Context: ${currentSubject} → ${currentTopic}]\n\nQuestion: ${userQuery}`,
          },
        ],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction,
        },
      });

      const text = response.text || "I was unable to generate a response. Please try rephrasing your question.";
      return res.json({
        answer: text,
        reply: text,
      });
    } catch (error: any) {
      console.error("Error in study assistant:", error);
      const fallback = `### GATE DA Conceptual Response\n\nWhile connecting to live AI services, here is the direct conceptual breakdown for **${req.body.topicName || "this topic"}**:\n\n1. **Core Principle**: In GATE DA, focus on first-principles derivations and matrix/probability representations.\n2. **Action Item**: Review standard definitions, solve previous year questions (PYQs), and verify edge cases.\n\n*Error details: ${error.message || "Request timed out"}*`;
      return res.json({
        answer: fallback,
        reply: fallback,
      });
    }
  };

  app.post("/api/ai/ask-assistant", handleStudyAssistant);
  app.post("/api/gemini/study-assistant", handleStudyAssistant);

  // ==========================================
  // API 2: Generate GATE DA Questions (Dual Endpoint)
  // ==========================================
  const handleGenerateQuestions = async (req: express.Request, res: express.Response) => {
    try {
      const {
        subject,
        subjectName,
        topic,
        topicName,
        difficulty = "Medium",
        count = 5,
        excludeQuestions = [],
      } = req.body;

      const subj = subject || subjectName || "Data Science & AI";
      const top = topic || topicName || "Probability and Statistics";
      const numQuestions = Math.min(Math.max(Number(count) || 5, 1), 10);

      const ai = getAIClient();
      if (!ai) {
        const fallbackQuestions = generateFallbackQuestions(subj, top, numQuestions, difficulty);
        return res.json({ questions: fallbackQuestions });
      }

      const prompt = `You are a premier GATE Data Science and Artificial Intelligence (DA) examination question creator.
Generate exactly ${numQuestions} high-quality, conceptual, and rigorous multiple-choice questions for the following GATE DA syllabus topic:
Subject: ${subj}
Topic: ${top}
Target Difficulty: ${difficulty}

Ensure these are authentic GATE-level questions testing mathematical depth, algorithmic thinking, or precise theoretical understanding.
Do NOT repeat the following concepts/questions if listed: ${JSON.stringify(excludeQuestions.slice(-10))}.

For each question:
1. Provide a clear problem statement (include mathematical formulas in plain text or LaTeX-like formatting).
2. Provide exactly 4 options.
3. Specify the correct option ('A', 'B', 'C', or 'D').
4. Provide a detailed, step-by-step mathematical or conceptual explanation.
5. Identify the core sub-concept being tested.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are an expert professor designing authentic GATE DA (Data Science & AI) questions. Output valid JSON matching the schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: {
                  type: Type.STRING,
                  description: "The complete question statement with equations and context.",
                },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Array of exactly 4 distinct options.",
                },
                correctAnswer: {
                  type: Type.STRING,
                  description: "The correct option index or letter ('A', 'B', 'C', or 'D').",
                },
                explanation: {
                  type: Type.STRING,
                  description: "Step-by-step solution and conceptual reasoning.",
                },
                concept: {
                  type: Type.STRING,
                  description: "Key concept name, formula, or theorem tested.",
                },
                difficulty: {
                  type: Type.STRING,
                  description: "Difficulty: Easy, Medium, Hard, or GATE Level",
                },
              },
              required: ["question", "options", "correctAnswer", "explanation", "concept"],
            },
          },
        },
      });

      const responseText = response.text || "[]";
      let parsed = [];
      try {
        parsed = JSON.parse(responseText);
      } catch (err) {
        console.error("Failed to parse JSON from model:", responseText);
        parsed = generateFallbackQuestions(subj, top, numQuestions, difficulty);
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        parsed = generateFallbackQuestions(subj, top, numQuestions, difficulty);
      }

      return res.json({ questions: parsed });
    } catch (error: any) {
      console.error("Error generating questions:", error);
      const subj = req.body.subject || req.body.subjectName || "Data Science & AI";
      const top = req.body.topic || req.body.topicName || "General Topic";
      const count = Number(req.body.count) || 5;
      const fallbackQuestions = generateFallbackQuestions(subj, top, count, req.body.difficulty || "Medium");
      return res.json({ questions: fallbackQuestions });
    }
  };

  app.post("/api/ai/generate-questions", handleGenerateQuestions);
  app.post("/api/gemini/generate-questions", handleGenerateQuestions);

  // ==========================================
  // API 3: Generate Topic Notes Summary (Dual Endpoint)
  // ==========================================
  const handleGenerateNotes = async (req: express.Request, res: express.Response) => {
    try {
      const { subject, subjectName, topic, topicName } = req.body;
      const subj = subject || subjectName || "GATE DA Subject";
      const top = topic || topicName || "GATE DA Topic";

      const ai = getAIClient();
      if (!ai) {
        const fallbackNotes = generateFallbackNotes(subj, top);
        return res.json({ notes: fallbackNotes });
      }

      const prompt = `Create comprehensive, high-yield GATE DA digital revision notes for:
Subject: ${subj}
Topic: ${top}

Provide:
1. Important Concepts: Core definitions, key theorems, properties.
2. Important Formulas: Equations, mathematical laws, bounds.
3. Examples: Solved numerical problems in standard GATE format.
4. My Understanding: Intuitive summary and mental anchors.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are an expert GATE DA professor writing digital cheatsheets. Output valid JSON matching the schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              importantConcepts: {
                type: Type.STRING,
                description: "Bullet-pointed essential definitions, theorems, and rules.",
              },
              importantFormulas: {
                type: Type.STRING,
                description: "Key mathematical equations, conditions, and properties.",
              },
              examples: {
                type: Type.STRING,
                description: "Worked numerical example or PYQ-style walkthrough.",
              },
              myUnderstanding: {
                type: Type.STRING,
                description: "Intuitive explanation in plain language.",
              },
            },
            required: ["importantConcepts", "importantFormulas", "examples", "myUnderstanding"],
          },
        },
      });

      const responseText = response.text || "{}";
      let parsedNotes: any = {};
      try {
        parsedNotes = JSON.parse(responseText);
      } catch (err) {
        parsedNotes = generateFallbackNotes(subj, top);
      }

      return res.json({ notes: parsedNotes });
    } catch (error: any) {
      console.error("Error generating notes:", error);
      const subj = req.body.subject || req.body.subjectName || "GATE DA";
      const top = req.body.topic || req.body.topicName || "Topic";
      return res.json({ notes: generateFallbackNotes(subj, top) });
    }
  };

  app.post("/api/ai/generate-notes", handleGenerateNotes);
  app.post("/api/gemini/generate-notes-summary", handleGenerateNotes);

  // ==========================================
  // API 4: Explain Wrong Answer in Depth
  // ==========================================
  const handleExplainWrongAnswer = async (req: express.Request, res: express.Response) => {
    try {
      const { question, options, selectedAnswer, correctAnswer, explanation, concept, topic } = req.body;

      const ai = getAIClient();
      if (!ai) {
        return res.json({
          explanation: `### Conceptual Analysis for ${concept || topic || "this problem"}
- **Correct Answer**: ${correctAnswer}
- **Why option ${selectedAnswer} is incorrect**: It overlooks the key mathematical constraint or condition of this theorem.
- **Key Takeaway**: Remember that ${explanation || "always verify the boundary conditions and step-by-step assumptions."}`,
        });
      }

      const prompt = `A student preparing for GATE DA made a mistake on this question:
Topic: ${topic}
Concept: ${concept}
Question: ${question}
Options: ${JSON.stringify(options)}
Student's Selected Answer: ${selectedAnswer}
Correct Answer: ${correctAnswer}
Official Explanation: ${explanation}

Please provide:
1. Why the student's answer is incorrect and what common misconception might have led to it.
2. The core concept / theorem / formula needed to solve this without doubt.
3. A quick memory anchor or tip to never repeat this mistake in GATE.
4. A similar quick test question with answer to check if they understood now.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are an empathetic yet rigorous GATE DA coach. Provide clear, encouraging, structured explanations.",
        },
      });

      return res.json({ explanation: response.text });
    } catch (error: any) {
      console.error("Error explaining wrong answer:", error);
      return res.json({
        explanation: `Error generating custom AI explanation: ${error.message}. Official explanation: ${req.body.explanation}`,
      });
    }
  };

  app.post("/api/ai/explain-wrong-answer", handleExplainWrongAnswer);
  app.post("/api/gemini/explain-wrong-answer", handleExplainWrongAnswer);

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GATE 2028 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
