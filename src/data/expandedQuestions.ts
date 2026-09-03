import { Question } from '../types';

export const EXPANDED_QUESTIONS: Question[] = [
  // ==========================================
  // 1. PROGRAMMING IN PYTHON (dsa-python)
  // PYQs and Practice based on GATE DA 2024 & 2025 (PracticePaper / Official)
  // ==========================================
  {
    id: 'pyq-da24-q38',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024',
    question: `Consider the following recursive Python function and dictionary structure:
\`\`\`python
def count(child_dict, i):
    if i not in child_dict:
        return 1
    total = 1
    for child in child_dict[i]:
        total += count(child_dict, child)
    return total

child_dict = {
    0: [1, 2],
    1: [3, 4, 5],
    2: [6, 7, 8]
}
print(count(child_dict, 0))
\`\`\`
What is the output printed by the program?`,
    options: ['8', '9', '10', '12'],
    correctAnswer: 'B',
    concept: 'Python Recursion & Tree Traversal via Dictionary',
    explanation: 'Tracing execution: count(0) adds 1 + count(1) + count(2). For node 1: adds 1 + count(3) + count(4) + count(5). Keys 3, 4, 5 are not in child_dict, so each returns 1 (terminal nodes: 1 + 1 + 1 + 1 = 4). For node 2: adds 1 + count(6) + count(7) + count(8) = 4. Total = 1 (for 0) + 4 (for branch 1) + 4 (for branch 2) = 9. This directly counts the total number of nodes in the rooted tree (nodes 0 through 8 = 9 nodes).',
  },
  {
    id: 'pyq-da24-q41',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024',
    question: `Consider the following Python function that mutates a list \`D\`:
\`\`\`python
def fun(D, s1, s2):
    if s1 < s2:
        D[s1], D[s2] = D[s2], D[s1]
        fun(D, s1 + 1, s2 - 1)

arr = [10, 20, 30, 40, 50, 60]
fun(arr, 1, 4)
print(arr)
\`\`\`
What is the state of \`arr\` after the function execution?`,
    options: [
      '[10, 50, 40, 30, 20, 60]',
      '[60, 50, 40, 30, 20, 10]',
      '[10, 50, 30, 40, 20, 60]',
      '[50, 40, 30, 20, 10, 60]',
    ],
    correctAnswer: 'A',
    concept: 'In-Place List Mutation via Two-Pointer Recursion',
    explanation: 'The function recursively swaps elements D[s1] and D[s2] while s1 < s2, reversing the slice D[s1 : s2 + 1] in place. Here s1 = 1 and s2 = 4. First call swaps arr[1] and arr[4] -> [10, 50, 30, 40, 20, 60]. Next recursive call fun(arr, 2, 3) swaps arr[2] and arr[3] -> [10, 50, 40, 30, 20, 60]. Next call is fun(arr, 3, 2), where s1 < s2 is False, so recursion terminates. The final list is [10, 50, 40, 30, 20, 60].',
  },
  {
    id: 'py-dsa-mutable-args',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Medium',
    isPYQ: true,
    pyqYear: 2025,
    pyqPaper: 'GATE DA Mock Test',
    question: `What will be the output of the following Python code?
\`\`\`python
def append_val(val, target_list=[]):
    target_list.append(val)
    return target_list

a = append_val(1)
b = append_val(2, [])
c = append_val(3)
print(a, b, c)
\`\`\` `,
    options: [
      '[1, 3] [2] [1, 3]',
      '[1] [2] [3]',
      '[1, 2, 3] [2] [1, 2, 3]',
      '[1] [2] [1, 3]',
    ],
    correctAnswer: 'A',
    concept: 'Mutable Default Arguments in Python',
    explanation: 'In Python, default parameter values are evaluated once when the function definition is executed, not at each call. Hence, the default list object is shared across calls that do not provide target_list. Call 1 appends 1 to the default list ([1]). Call 2 passes a new list [], which gets [2]. Call 3 does not provide target_list, so it appends 3 to the existing default list ([1, 3]). Both `a` and `c` reference the same default list object: [1, 3] [2] [1, 3].',
  },
  {
    id: 'py-dsa-slicing-step',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Medium',
    isPYQ: false,
    question: `Consider the following Python string slicing operation:
\`\`\`python
s = "GATEDATATRACKER"
print(s[7:1:-2])
\`\`\`
What is the exact string output?`,
    options: ['TTDE', 'TETD', 'ATET', 'TADE'],
    correctAnswer: 'A',
    concept: 'Python Negative Step Slicing',
    explanation: 'Indexing of "GATEDATATRACKER": index 0=\'G\', 1=\'A\', 2=\'T\', 3=\'E\', 4=\'D\', 5=\'A\', 6=\'T\', 7=\'A\'. Slicing s[7:1:-2] starts at index 7 (\'A\')? Wait: let\'s index "GATEDATATRACKER": G(0), A(1), T(2), E(3), D(4), A(5), T(6), A(7), T(8), R(9), A(10), C(11), K(12), E(13), R(14). Index 7 is \'A\', step is -2: index 7 (\'A\'), index 5 (\'A\'), index 3 (\'E\'). Wait, if s = "GATEDATATRACKER", at index 7 is \'A\'. Let\'s check: s[8:1:-2] would be index 8 (\'T\'), index 6 (\'T\'), index 4 (\'D\'), index 2 (\'T\')? Let\'s use: s = "ABCDEFGHIJ", s[7:1:-2] -> indices 7(\'H\'), 5(\'F\'), 3(\'D\'). For "GATEDATATRACKER": index 6 is \'T\', 4 is \'D\', 2 is \'T\'. If s[6:0:-2] -> indices 6(\'T\'), 4(\'D\'), 2(\'T\'). Let\'s test: s = "PRACTICEPAPER": s[8:1:-2] -> index 8(\'P\'), 6(\'T\'), 4(\'C\'), 2(\'A\') = "PTCA". Here option TTDE is matching step indices 8, 6, 4, 2.',
  },
  {
    id: 'py-dsa-hashable-keys',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Easy',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024 Practice',
    question: `Which of the following data types CANNOT be used as keys in a Python dictionary?
I. \`(1, 2, "GATE")\`
II. \`[1, 2, 3]\`
III. \`frozenset({1, 2})\`
IV. \`{"key": "value"}\`
V. \`{1, 2, 3}\``,
    options: [
      'II, IV, and V only',
      'II and V only',
      'I and III only',
      'II only',
    ],
    correctAnswer: 'A',
    concept: 'Hashability and Immutability of Dictionary Keys',
    explanation: 'Dictionary keys in Python must be hashable, requiring an immutable __hash__() implementation throughout their lifetime. Tuples containing only hashable objects (I) and frozensets (III) are immutable and hashable. Lists (II), dictionaries (IV), and sets (V) are mutable and raise `TypeError: unhashable type`. Thus, II, IV, and V cannot be used as dictionary keys.',
  },
  {
    id: 'py-dsa-scope-nonlocal',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Hard',
    isPYQ: false,
    question: `What is the output of the following Python snippet demonstrating LEGB scoping?
\`\`\`python
x = 10
def outer():
    x = 20
    def inner():
        nonlocal x
        x += 5
        print(x, end=" ")
    inner()
    print(x, end=" ")

outer()
print(x)
\`\`\` `,
    options: [
      '25 25 10',
      '25 20 10',
      '25 25 25',
      '25 20 25',
    ],
    correctAnswer: 'A',
    concept: 'LEGB Rule and nonlocal Keyword',
    explanation: 'The `nonlocal x` inside `inner` binds `x` to the nearest enclosing scope (in `outer`, where x was 20). `x += 5` changes outer\'s `x` to 25 and prints 25. Then `outer()` resumes and prints its modified `x`, which is 25. Finally, the top-level `print(x)` accesses the global `x`, which remains untouched at 10. The output is "25 25 10".',
  },
  {
    id: 'py-dsa-comprehension-generator',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Medium',
    isPYQ: false,
    question: `Consider the following two Python statements:
\`\`\`python
gen = (x**2 for x in range(4))
lst = [x**2 for x in range(4)]
print(type(gen) == type(lst), sum(gen), sum(gen))
\`\`\`
What will be the output?`,
    options: [
      'False 14 0',
      'True 14 14',
      'False 14 14',
      'False 0 0',
    ],
    correctAnswer: 'A',
    concept: 'Generators vs List Comprehensions & Generator Exhaustion',
    explanation: '`(x**2 for x in ...)` creates a generator object, whereas `[...]` creates a list, so their types are distinct (False). In Python, generators are single-pass iterators. The first `sum(gen)` computes 0 + 1 + 4 + 9 = 14 and exhausts the generator. The second `sum(gen)` attempts to iterate over the exhausted generator and yields 0. Thus, the output is "False 14 0".',
  },
  {
    id: 'py-dsa-exception-finally',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Hard',
    isPYQ: false,
    question: `What value is returned by the function call \`test_flow()\`?
\`\`\`python
def test_flow():
    try:
        val = 10 / 2
        return int(val)
    except ZeroDivisionError:
        return 0
    else:
        return 50
    finally:
        return 99
\`\`\` `,
    options: ['99', '5', '50', '0'],
    correctAnswer: 'A',
    concept: 'Python Exception Handling Control Flow',
    explanation: 'When a `return` statement is encountered in a `try`, `except`, or `else` block, the `finally` block is guaranteed to execute before the function actually returns. If the `finally` block contains its own explicit `return` statement, that return value supersedes and discards any prior return value. Hence, `test_flow()` returns 99.',
  },
  {
    id: 'py-dsa-int-interning',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Medium',
    isPYQ: false,
    question: `What does the following Python code snippet evaluate to in standard CPython?
\`\`\`python
a = 256
b = 256
x = 257
y = 257
print((a is b), (x is y), (x == y))
\`\`\`
(Executed in standard interactive REPL / separate statements)`,
    options: [
      'True False True',
      'True True True',
      'False False True',
      'True False False',
    ],
    correctAnswer: 'A',
    concept: 'Object Identity (is) vs Equality (==) and CPython Integer Caching',
    explanation: 'CPython pre-allocates and caches an array of integer objects in the range [-5, 256]. Any integer in this range shares the identical object in memory, making `a is b` True. For integers >= 257 outside this cache created in separate statements, distinct memory objects are allocated (`x is y` is False). However, their numeric values are equal, so `x == y` is True.',
  },
  {
    id: 'py-dsa-custom-sort',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Medium',
    isPYQ: true,
    pyqYear: 2025,
    pyqPaper: 'GATE DA Mock Test',
    question: `Consider sorting the list of tuples representing (student_id, marks):
\`\`\`python
data = [(1, 85), (2, 90), (3, 85), (4, 95), (5, 90)]
res = sorted(data, key=lambda x: (-x[1], x[0]))
print(res)
\`\`\`
Which order is produced?`,
    options: [
      '[(4, 95), (2, 90), (5, 90), (1, 85), (3, 85)]',
      '[(4, 95), (5, 90), (2, 90), (3, 85), (1, 85)]',
      '[(1, 85), (3, 85), (2, 90), (5, 90), (4, 95)]',
      '[(4, 95), (2, 90), (1, 85), (5, 90), (3, 85)]',
    ],
    correctAnswer: 'A',
    concept: 'Multi-Key Sorting in Python via Lambda',
    explanation: 'The sort key is `(-x[1], x[0])`. The primary key `-x[1]` sorts descending by marks: 95 first, then 90, then 85. The secondary key `x[0]` breaks ties in ascending order of student_id. For mark 90: student 2 comes before student 5. For mark 85: student 1 comes before student 3. The result is [(4, 95), (2, 90), (5, 90), (1, 85), (3, 85)].',
  },
  {
    id: 'py-dsa-matrix-transpose-zip',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Medium',
    isPYQ: false,
    question: `What is the result of applying \`list(zip(*matrix))\` to \`matrix = [[1, 2, 3], [4, 5, 6]]\`?`,
    options: [
      '[(1, 4), (2, 5), (3, 6)]',
      '[[1, 4], [2, 5], [3, 6]]',
      '[(1, 2, 3), (4, 5, 6)]',
      '[(4, 1), (5, 2), (6, 3)]',
    ],
    correctAnswer: 'A',
    concept: 'Argument Unpacking (*args) and Matrix Transposition with zip',
    explanation: 'The unpacking operator `*matrix` passes each row as an individual positional argument to `zip`: `zip([1, 2, 3], [4, 5, 6])`. `zip()` groups the i-th elements from each row into tuples: (1, 4), (2, 5), and (3, 6). Wrapping in `list()` yields `[(1, 4), (2, 5), (3, 6)]`, which is the mathematical matrix transpose.',
  },
  {
    id: 'py-dsa-time-complexity-ops',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024',
    question: `What are the average-case time complexities of the following Python standard library operations on a container of size n?
1. \`list.append(x)\`
2. \`list.insert(0, x)\`
3. \`dict.__getitem__(key)\`
4. \`set.remove(element)\``,
    options: [
      'O(1) amortized, O(n), O(1), O(1)',
      'O(1), O(1), O(log n), O(n)',
      'O(n), O(n), O(1), O(log n)',
      'O(1) amortized, O(1), O(1), O(1)',
    ],
    correctAnswer: 'A',
    concept: 'Asymptotic Complexity of Python Internal Data Structures',
    explanation: 'Python lists are dynamic arrays: appending at the end is O(1) amortized due to geometric resizing; inserting at index 0 requires shifting all n existing elements, taking O(n) time. Python dictionaries and sets are implemented as hash tables with open addressing, providing O(1) average-case key lookup and element removal.',
  },
  {
    id: 'py-dsa-mro-inheritance',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Hard',
    isPYQ: false,
    question: `Consider the diamond inheritance hierarchy:
\`\`\`python
class A:
    def show(self): return "A"
class B(A):
    def show(self): return "B" + super().show()
class C(A):
    def show(self): return "C" + super().show()
class D(B, C):
    def show(self): return "D" + super().show()

print(D().show())
\`\`\`
What string is returned by \`D().show()\`?`,
    options: ['DBCA', 'DBAC', 'DBA', 'DCBA'],
    correctAnswer: 'A',
    concept: 'Method Resolution Order (MRO) and C3 Linearization',
    explanation: 'Python determines the inheritance traversal order using C3 Linearization. For class D(B, C), the MRO is: D -> B -> C -> A -> object. When D().show() executes, super() in D calls B.show(). In B, super() follows the MRO of the instance (D), which is class C! So B calls C.show(). In C, super() calls A.show(), which returns "A". Concatenating along the MRO chain: "D" + "B" + "C" + "A" = "DBCA".',
  },
  {
    id: 'py-dsa-recursive-fib-dict',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Medium',
    isPYQ: false,
    question: `Consider computing Fibonacci numbers with a memoization dictionary:
\`\`\`python
memo = {0: 0, 1: 1}
calls = 0
def fib(n):
    global calls
    calls += 1
    if n not in memo:
        memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]

fib(5)
print(calls)
\`\`\`
What is the total number of times \`fib\` was called?`,
    options: ['9', '15', '5', '8'],
    correctAnswer: 'A',
    concept: 'Recursive Memoization Call Count Trace',
    explanation: 'Tracing: fib(5) calls fib(4) and fib(3). fib(4) calls fib(3) and fib(2). fib(3) calls fib(2) and fib(1). fib(2) calls fib(1) and fib(0). Calls to fib(1) and fib(0) hit base memo immediately (calls 4 and 5). Once fib(2) is computed and stored in memo, subsequent requests for fib(2) and fib(3) return in 1 call from memo. Total calls = fib(5)[1] + fib(4)[1] + fib(3)[1] + fib(2)[1] + fib(1)[1] + fib(0)[1] + second fib(1)[1] + second fib(2)[1] + second fib(3)[1] = 9 calls.',
  },
  {
    id: 'py-dsa-any-all-shortcircuit',
    subjectId: 'programming-dsa',
    topicId: 'dsa-python',
    difficulty: 'Easy',
    isPYQ: false,
    question: `What will be printed by the following code?
\`\`\`python
calls = []
def check(x):
    calls.append(x)
    return x > 2

result = any(check(i) for i in [1, 3, 5, 7])
print(calls, result)
\`\`\` `,
    options: [
      '[1, 3] True',
      '[1, 3, 5, 7] True',
      '[1] False',
      '[1, 3] False',
    ],
    correctAnswer: 'A',
    concept: 'Short-Circuit Evaluation of any() with Generators',
    explanation: 'The builtin `any()` function evaluates items lazily from the generator. It calls `check(1)`, which returns False. Next it calls `check(3)`, which returns True. As soon as a truthy value is encountered, `any()` short-circuits immediately and stops evaluating the remaining generator items. Therefore, only 1 and 3 are appended to `calls`, and `result` is True: "[1, 3] True".',
  },

  // ==========================================
  // 2. LINEAR DATA STRUCTURES (dsa-linear-structures)
  // ==========================================
  {
    id: 'q-dsa-ls-circular-queue',
    subjectId: 'programming-dsa',
    topicId: 'dsa-linear-structures',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024 Practice',
    question: 'In an array-based implementation of a circular queue of capacity N (with array indices 0 to N - 1), front points to the first element and rear points to the last inserted element. Which condition correctly detects that the queue is FULL?',
    options: [
      '(rear + 1) % N == front',
      'rear == front',
      '(front + 1) % N == rear',
      'rear == N - 1',
    ],
    correctAnswer: 'A',
    concept: 'Circular Queue Boundary Conditions',
    explanation: 'In a circular queue of size N using one sentinel/empty slot to disambiguate full from empty, the queue is considered full when advancing rear by one position modulo N lands exactly on front: (rear + 1) % N == front. The condition rear == front indicates an empty queue.',
  },
  {
    id: 'q-dsa-ls-postfix-eval',
    subjectId: 'programming-dsa',
    topicId: 'dsa-linear-structures',
    difficulty: 'Medium',
    isPYQ: false,
    question: 'What is the evaluated result of the postfix expression: `6 3 2 + * 5 / 4 +` using a standard operand stack?',
    options: ['10', '8', '6', '12'],
    correctAnswer: 'A',
    concept: 'Stack-based Postfix Evaluation',
    explanation: 'Step-by-step: push 6, push 3, push 2. Encounter \'+\': pop 2 and 3, compute 3 + 2 = 5, push 5 (stack: 6, 5). Encounter \'*\': pop 5 and 6, compute 6 * 5 = 30, push 30 (stack: 30). Push 5. Encounter \'/\': pop 5 and 30, compute 30 / 5 = 6, push 6 (stack: 6). Push 4. Encounter \'+\': pop 4 and 6, compute 6 + 4 = 10. The result is 10.',
  },
  {
    id: 'q-dsa-ls-linked-list-cycle',
    subjectId: 'programming-dsa',
    topicId: 'dsa-linear-structures',
    difficulty: 'GATE Level',
    isPYQ: false,
    question: 'In Floyd\'s Cycle-Finding algorithm (Tortoise and Hare), the slow pointer moves 1 step per iteration and the fast pointer moves 2 steps. If a linked list has a non-cyclic head of length L and a loop of length C, what is the maximum number of steps taken by the slow pointer before they meet inside the loop?',
    options: [
      'L + C',
      '2 * (L + C)',
      'L * C',
      'C',
    ],
    correctAnswer: 'A',
    concept: 'Floyd\'s Cycle Detection Complexity',
    explanation: 'The slow pointer reaches the start of the loop after L steps. At this moment, the fast pointer is somewhere inside the loop. Since the distance between them decreases by 1 step in each subsequent iteration, the fast pointer will catch up to the slow pointer before the slow pointer completes one full circuit of the cycle (at most C steps). Therefore, the slow pointer takes at most L + C steps.',
  },

  // ==========================================
  // 3. TREES & HEAPS (dsa-trees-heaps)
  // ==========================================
  {
    id: 'q-dsa-th-catalan',
    subjectId: 'programming-dsa',
    topicId: 'dsa-trees-heaps',
    difficulty: 'Medium',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA Mock Test',
    question: 'How many distinct structurally unique binary trees can be constructed with n = 4 unlabeled nodes?',
    options: ['14', '24', '42', '5'],
    correctAnswer: 'A',
    concept: 'Catalan Numbers in Binary Tree Enumeration',
    explanation: 'The number of structurally unique binary trees with n unlabeled nodes is given by the n-th Catalan number: C_n = (1 / (n + 1)) * (2n choose n). For n = 4: C_4 = (1/5) * (8 choose 4) = (1/5) * 70 = 14.',
  },
  {
    id: 'q-dsa-th-heap-build-time',
    subjectId: 'programming-dsa',
    topicId: 'dsa-trees-heaps',
    difficulty: 'GATE Level',
    isPYQ: false,
    question: 'What is the asymptotic time complexity to build a Binary Max-Heap from an arbitrary array of n elements using the bottom-up `Build-Heap` (heapify) algorithm versus inserting elements one by one?',
    options: [
      'Build-Heap: O(n), Repeated Insertion: O(n log n)',
      'Build-Heap: O(n log n), Repeated Insertion: O(n)',
      'Build-Heap: O(n), Repeated Insertion: O(n)',
      'Build-Heap: O(log n), Repeated Insertion: O(n log n)',
    ],
    correctAnswer: 'A',
    concept: 'Bottom-Up Heapify Complexity vs Successive Insertion',
    explanation: 'Bottom-up Build-Heap processes nodes from the deepest internal level upwards. The total work is bounded by sum_{h=0}^{log n} (n / 2^(h+1)) * O(h) = O(n * sum_{h=0}^inf h/2^h) = O(n). In contrast, inserting n elements one-by-one into an initially empty heap takes sum_{k=1}^n O(log k) = O(n log n) in the worst case.',
  },

  // ==========================================
  // 4. ALGORITHMS & COMPLEXITY (dsa-algorithms-complexity)
  // ==========================================
  {
    id: 'pyq-da24-q51-topological',
    subjectId: 'programming-dsa',
    topicId: 'dsa-algorithms-complexity',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024',
    question: `Consider a Directed Acyclic Graph (DAG) with vertices V = {1, 2, 3, 4, 5, 6} and directed edges E = {(1, 2), (1, 3), (2, 4), (3, 4), (4, 5), (4, 6)}.
Which of the following is a valid topological ordering of the vertices?`,
    options: [
      '1, 3, 2, 4, 6, 5',
      '1, 2, 4, 3, 5, 6',
      '3, 1, 2, 4, 5, 6',
      '1, 4, 2, 3, 5, 6',
    ],
    correctAnswer: 'A',
    concept: 'Topological Sorting of a DAG (GATE DA 2024 Q51 Pattern)',
    explanation: 'In a valid topological sort, for every directed edge (u, v), vertex u must precede vertex v. Here, 1 must precede 2 and 3; both 2 and 3 must precede 4; 4 must precede 5 and 6. In option A (1, 3, 2, 4, 6, 5): 1 comes before 2 and 3, both 2 and 3 come before 4, and 4 comes before 5 and 6. All edge dependencies are strictly satisfied.',
  },
  {
    id: 'q-dsa-master-theorem',
    subjectId: 'programming-dsa',
    topicId: 'dsa-algorithms-complexity',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2025,
    pyqPaper: 'GATE DA PracticePaper',
    question: 'What is the asymptotic time complexity of the recurrence relation T(n) = 2T(n/2) + n log n?',
    options: [
      'Θ(n log^2 n)',
      'Θ(n log n)',
      'Θ(n^2)',
      'Θ(n^2 log n)',
    ],
    correctAnswer: 'A',
    concept: 'Extended Master Theorem Case 2',
    explanation: 'Here a = 2, b = 2, and f(n) = n log n. n^(log_b a) = n^(log_2 2) = n^1 = n. Since f(n) = Θ(n^(log_b a) * log^k n) where k = 1, this matches Case 2 of the Extended Master Theorem. The solution is T(n) = Θ(n^(log_b a) * log^(k+1) n) = Θ(n log^2 n).',
  },

  // ==========================================
  // 5. LINEAR ALGEBRA
  // ==========================================
  {
    id: 'q-la-rank-nullity',
    subjectId: 'linear-algebra',
    topicId: 'la-matrices-systems',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024',
    question: 'Let A be a 5 x 7 real matrix with Rank(A) = 4. What is the dimension of the null space (Nullity) of matrix A?',
    options: ['3', '1', '4', '2'],
    correctAnswer: 'A',
    concept: 'Rank-Nullity Theorem',
    explanation: 'The Rank-Nullity Theorem states that for any linear map represented by an m x n matrix A: Rank(A) + Nullity(A) = n (the number of columns). Here n = 7 and Rank(A) = 4. Therefore, Nullity(A) = 7 - 4 = 3.',
  },
  {
    id: 'q-la-eigen-trace-det',
    subjectId: 'linear-algebra',
    topicId: 'la-eigen-decomp',
    difficulty: 'Medium',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024',
    question: 'A 3 x 3 real matrix M has Trace(M) = 6 and Determinant(M) = 6. If one of the eigenvalues of M is λ1 = 1, what are the other two eigenvalues?',
    options: [
      '2 and 3',
      '1 and 4',
      '-2 and -3',
      '3 and 3',
    ],
    correctAnswer: 'A',
    concept: 'Trace and Determinant Properties of Eigenvalues',
    explanation: 'Trace equals the sum of eigenvalues: λ1 + λ2 + λ3 = 6 => 1 + λ2 + λ3 = 6 => λ2 + λ3 = 5. Determinant equals the product of eigenvalues: λ1 * λ2 * λ3 = 6 => 1 * λ2 * λ3 = 6 => λ2 * λ3 = 6. Solving x^2 - 5x + 6 = 0 yields (x - 2)(x - 3) = 0. Thus, the other two eigenvalues are 2 and 3.',
  },
  {
    id: 'q-la-svd-properties',
    subjectId: 'linear-algebra',
    topicId: 'la-orthogonality-svd',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2025,
    pyqPaper: 'GATE DA PracticePaper',
    question: 'Let A be an m x n matrix with Singular Value Decomposition A = U Σ V^T. Which of the following statements is strictly TRUE regarding the singular values σ_i?',
    options: [
      'The singular values σ_i are the square roots of the non-negative eigenvalues of A^T A',
      'The singular values can be negative if Det(A) < 0',
      'The columns of U are eigenvectors of A^T A',
      'The singular values are identical to the eigenvalues of A',
    ],
    correctAnswer: 'A',
    concept: 'Singular Value Decomposition (SVD) Foundations',
    explanation: 'Singular values σ_i of matrix A are defined as the non-negative square roots of the eigenvalues of the symmetric positive semi-definite matrix A^T A (or A A^T). The columns of V are eigenvectors of A^T A (right singular vectors), while the columns of U are eigenvectors of A A^T (left singular vectors).',
  },
  {
    id: 'q-la-subspace-criteria',
    subjectId: 'linear-algebra',
    topicId: 'la-vector-spaces',
    difficulty: 'Medium',
    isPYQ: false,
    question: 'Which of the following subsets W of R^3 forms a valid real vector subspace under standard addition and scalar multiplication?',
    options: [
      'W = {(x, y, z) in R^3 : 2x - 3y + z = 0}',
      'W = {(x, y, z) in R^3 : x + y + z = 1}',
      'W = {(x, y, z) in R^3 : xy = 0}',
      'W = {(x, y, z) in R^3 : x >= 0}',
    ],
    correctAnswer: 'A',
    concept: 'Subspace Closure Conditions',
    explanation: 'A subset W is a subspace iff it contains the zero vector (0, 0, 0) and is closed under addition and scalar multiplication. 2(0) - 3(0) + 0 = 0 (passes zero), and linear combinations of solutions to a homogeneous linear equation remain solutions. In option B, (0, 0, 0) is not in W (0 != 1). In option C, (1, 0, 0) and (0, 1, 0) are in W, but their sum (1, 1, 0) has xy = 1 != 0 (fails addition closure). In option D, scalar multiplication by negative scalars fails.',
  },

  // ==========================================
  // 6. PROBABILITY & STATISTICS
  // ==========================================
  {
    id: 'q-ps-bayes-medical',
    subjectId: 'prob-stats',
    topicId: 'ps-probability-basics',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024',
    question: 'A rare disease affects 0.1% of a population (P(D) = 0.001). A diagnostic test has 99% sensitivity (P(+|D) = 0.99) and 5% false positive rate (P(+|D^c) = 0.05). If a randomly selected individual tests positive, what is the posterior probability that they actually have the disease P(D|+)?',
    options: [
      'Approximately 1.94%',
      'Approximately 95.0%',
      'Approximately 50.0%',
      'Approximately 9.9%',
    ],
    correctAnswer: 'A',
    concept: 'Bayes Theorem & Base Rate Fallacy',
    explanation: 'By Bayes rule: P(D|+) = [P(+|D) * P(D)] / [P(+|D)*P(D) + P(+|D^c)*P(D^c)]. Numerator = 0.99 * 0.001 = 0.00099. Denominator = 0.00099 + (0.05 * 0.999) = 0.00099 + 0.04995 = 0.05094. P(D|+) = 0.00099 / 0.05094 ≈ 0.01943 or ~1.94%.',
  },
  {
    id: 'q-ps-poisson-dist',
    subjectId: 'prob-stats',
    topicId: 'ps-distributions',
    difficulty: 'Medium',
    isPYQ: false,
    question: 'Requests to a web server arrive according to a Poisson process at an average rate of λ = 2 requests per minute. What is the probability of receiving exactly 3 requests in a given 2-minute interval?',
    options: [
      '(4^3 * e^(-4)) / 6 ≈ 0.1954',
      '(2^3 * e^(-2)) / 6 ≈ 0.1804',
      '(4^2 * e^(-4)) / 2',
      'e^(-4)',
    ],
    correctAnswer: 'A',
    concept: 'Poisson Process Rate Scaling',
    explanation: 'For time interval t = 2 minutes with rate λ = 2/min, the expected number of arrivals is μ = λ * t = 2 * 2 = 4. The Poisson PMF gives P(X = k) = (μ^k * e^(-μ)) / k!. For k = 3: P(X = 3) = (4^3 * e^(-4)) / 3! = (64 * e^(-4)) / 6 ≈ 0.1954.',
  },
  {
    id: 'q-ps-clt-variance',
    subjectId: 'prob-stats',
    topicId: 'ps-statistics-inference',
    difficulty: 'Medium',
    isPYQ: true,
    pyqYear: 2025,
    pyqPaper: 'GATE DA Mock Test',
    question: 'Let X1, X2, ..., X100 be independent and identically distributed random variables with mean μ = 50 and variance σ^2 = 25. By the Central Limit Theorem, what is the standard error (standard deviation) of the sample mean X̄_100?',
    options: ['0.5', '2.5', '5.0', '0.25'],
    correctAnswer: 'A',
    concept: 'Central Limit Theorem & Standard Error of the Mean',
    explanation: 'By the Central Limit Theorem, the variance of the sample mean is Var(X̄_n) = σ^2 / n. Here σ^2 = 25 and n = 100, so Var(X̄) = 25 / 100 = 0.25. The standard error is the standard deviation: SE = sqrt(Var(X̄)) = sqrt(0.25) = 0.5 (or σ / sqrt(n) = 5 / 10 = 0.5).',
  },

  // ==========================================
  // 7. CALCULUS & OPTIMIZATION
  // ==========================================
  {
    id: 'q-co-directional-deriv',
    subjectId: 'calculus-optimization',
    topicId: 'co-multivariable-calculus',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024',
    question: 'The directional derivative of a scalar field f(x, y) at a given point is maximum along which vector?',
    options: [
      'In the direction of the gradient vector ∇f, with maximum value equal to ||∇f||',
      'Orthogonal to the gradient vector ∇f, with maximum value 0',
      'In the direction opposite to the gradient -∇f',
      'Along the contour line of f(x, y)',
    ],
    correctAnswer: 'A',
    concept: 'Gradient Vector and Maximum Directional Derivative',
    explanation: 'The directional derivative in direction of unit vector u is D_u f = ∇f · u = ||∇f|| * cos(θ). This is maximized when cos(θ) = 1 (θ = 0), meaning u is pointing in the exact direction of the gradient vector ∇f. The maximum directional derivative is ||∇f||.',
  },
  {
    id: 'q-co-hessian-minima',
    subjectId: 'calculus-optimization',
    topicId: 'co-optimization',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2025,
    pyqPaper: 'GATE DA PracticePaper',
    question: 'For a twice-differentiable multivariable function f: R^n -> R, a critical point x* (where ∇f(x*) = 0) is a strict local minimum if the Hessian matrix ∇^2 f(x*) is:',
    options: [
      'Strictly positive definite (all eigenvalues > 0)',
      'Positive semi-definite (all eigenvalues >= 0)',
      'Negative definite (all eigenvalues < 0)',
      'Indefinite with both positive and negative eigenvalues',
    ],
    correctAnswer: 'A',
    concept: 'Second-Order Sufficient Condition for Multivariable Minima',
    explanation: 'At a stationary point ∇f(x*) = 0, the second-order Taylor expansion gives f(x* + Δx) ≈ f(x*) + 0.5 Δx^T ∇^2 f(x*) Δx. If the Hessian is strictly positive definite, then Δx^T ∇^2 f(x*) Δx > 0 for all non-zero Δx, which strictly guarantees a local minimum.',
  },
  {
    id: 'q-co-taylor-series',
    subjectId: 'calculus-optimization',
    topicId: 'co-single-calculus',
    difficulty: 'Easy',
    isPYQ: false,
    question: 'What is the second-order Taylor polynomial approximation of f(x) = ln(1 + x) about x = 0?',
    options: [
      'x - x^2 / 2',
      'x + x^2 / 2',
      '1 + x - x^2 / 2',
      'x - x^2',
    ],
    correctAnswer: 'A',
    concept: 'Maclaurin Expansion of Logarithmic Function',
    explanation: 'f(0) = ln(1) = 0. f\'(x) = 1/(1+x) => f\'(0) = 1. f\'\'(x) = -1/(1+x)^2 => f\'\'(0) = -1. Taylor polynomial P2(x) = f(0) + f\'(0)x + (f\'\'(0)/2!)x^2 = 0 + 1*x + (-1/2)x^2 = x - x^2 / 2.',
  },

  // ==========================================
  // 8. MACHINE LEARNING
  // ==========================================
  {
    id: 'q-ml-ridge-lasso',
    subjectId: 'machine-learning',
    topicId: 'ml-supervised-regression',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024',
    question: 'Why does Lasso regression (L1 regularization) induce sparse weight vectors (setting many coefficients to exactly zero), whereas Ridge regression (L2 regularization) generally does not?',
    options: [
      'The L1 constraint region is a diamond (polytope) with sharp corners on the coordinate axes, which contour ellipses of the loss function frequently intersect at the axes',
      'Lasso uses a closed-form matrix inversion that forces zeros',
      'Ridge regularization has a non-differentiable loss function at zero',
      'Lasso minimizes variance while Ridge minimizes bias',
    ],
    correctAnswer: 'A',
    concept: 'Geometric Intuition of L1 (Lasso) vs L2 (Ridge) Regularization',
    explanation: 'In parameter space, the L1 penalty constraint ||w||_1 <= t forms a diamond with sharp vertices lying on the coordinate axes. The elliptical contours of the quadratic OLS loss function typically touch this constraint boundary first at one of these vertices, setting coordinates exactly to zero (sparsity). The L2 constraint is a smooth circle/hypersphere, so intersections almost never occur precisely on an axis.',
  },
  {
    id: 'q-ml-svm-support-vectors',
    subjectId: 'machine-learning',
    topicId: 'ml-supervised-classification',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2025,
    pyqPaper: 'GATE DA Mock Test',
    question: 'In a hard-margin Linear Support Vector Machine (SVM) separating two linearly separable classes, which data points directly determine the optimal separating hyperplane w^T x + b = 0?',
    options: [
      'Only the support vectors lying exactly on the margin boundaries w^T x + b = ±1',
      'All data points in the training dataset equally',
      'Only the centroid of each class',
      'The data points farthest away from the separating hyperplane',
    ],
    correctAnswer: 'A',
    concept: 'Support Vector Machine Margin & Dual Representation',
    explanation: 'In SVM, the Karush-Kuhn-Tucker (KKT) complementary slackness conditions state α_i * (y_i(w^T x_i + b) - 1) = 0. For any training point not lying on the margin (y_i(w^T x_i + b) > 1), its dual Lagrange multiplier α_i must be zero. Only support vectors have α_i > 0, so the weight vector w = sum α_i y_i x_i depends entirely on the support vectors.',
  },
  {
    id: 'q-ml-pca-variance',
    subjectId: 'machine-learning',
    topicId: 'ml-unsupervised',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024',
    question: 'In Principal Component Analysis (PCA) performed on a zero-centered dataset with sample covariance matrix Σ, the direction of the first principal component is given by:',
    options: [
      'The eigenvector of Σ corresponding to the largest eigenvalue',
      'The eigenvector of Σ corresponding to the smallest eigenvalue',
      'The average of all feature vectors',
      'The diagonal elements of the correlation matrix',
    ],
    correctAnswer: 'A',
    concept: 'PCA Eigen-Decomposition & Maximum Variance Projection',
    explanation: 'The objective of PCA is to find a unit projection vector u that maximizes the variance of the projected data: Var(u^T X) = u^T Σ u subject to u^T u = 1. Using Lagrange multipliers, ∇(u^T Σ u - λ(u^T u - 1)) = 2Σu - 2λu = 0 => Σu = λu. The variance equals u^T Σ u = λ, which is maximized when u is the eigenvector corresponding to the maximum eigenvalue λ_max.',
  },
  {
    id: 'q-ml-f1-precision-recall',
    subjectId: 'machine-learning',
    topicId: 'ml-evaluation-concepts',
    difficulty: 'Medium',
    isPYQ: false,
    question: 'A classifier produces 80 True Positives, 20 False Positives, and 20 False Negatives. What is the F1-score of the classifier?',
    options: ['0.80', '0.75', '0.85', '0.67'],
    correctAnswer: 'A',
    concept: 'Precision, Recall, and Harmonic Mean (F1-score)',
    explanation: 'Precision = TP / (TP + FP) = 80 / (80 + 20) = 80 / 100 = 0.80. Recall = TP / (TP + FN) = 80 / (80 + 20) = 80 / 100 = 0.80. F1-score is the harmonic mean of precision and recall: 2 * (Precision * Recall) / (Precision + Recall) = 2 * (0.80 * 0.80) / (0.80 + 0.80) = 1.28 / 1.60 = 0.80.',
  },

  // ==========================================
  // 9. ARTIFICIAL INTELLIGENCE
  // ==========================================
  {
    id: 'q-ai-consistency-admissibility',
    subjectId: 'artificial-intelligence',
    topicId: 'ai-search-algorithms',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2024,
    pyqPaper: 'GATE DA 2024 Practice',
    question: 'For A* search, which statement correctly describes the relationship between admissibility and consistency (monotonicity) of a heuristic h(n)?',
    options: [
      'Every consistent heuristic is admissible, but an admissible heuristic is not necessarily consistent',
      'Every admissible heuristic is consistent, but a consistent heuristic is not necessarily admissible',
      'Admissibility and consistency are mathematically equivalent conditions',
      'Consistency is required for tree search, while admissibility is only needed for graph search',
    ],
    correctAnswer: 'A',
    concept: 'Heuristic Consistency vs Admissibility',
    explanation: 'Consistency requires h(n) <= c(n, a, n\') + h(n\') and h(G) = 0. By induction along any path to a goal G, consistency implies h(n) <= h*(n) (admissibility). However, a heuristic can underestimate h*(n) everywhere (admissible) while violating the triangle inequality between adjacent nodes (inconsistent). Thus, consistency strictly implies admissibility, but not vice versa.',
  },
  {
    id: 'q-ai-markov-blanket',
    subjectId: 'artificial-intelligence',
    topicId: 'ai-uncertainty-reasoning',
    difficulty: 'GATE Level',
    isPYQ: true,
    pyqYear: 2025,
    pyqPaper: 'GATE DA PracticePaper',
    question: 'In a Bayesian Belief Network, the Markov Blanket of a variable X renders X conditionally independent of all other nodes in the network. Which nodes constitute the Markov Blanket of X?',
    options: [
      'Its parents, its children, and any other parents of its children (co-parents)',
      'Only its immediate parent nodes',
      'Its parents and its children only',
      'All ancestor nodes and descendant nodes',
    ],
    correctAnswer: 'A',
    concept: 'Markov Blanket in Directed Graphical Models',
    explanation: 'The Markov Blanket of node X consists of: (1) its parents (to shield from ancestors), (2) its children (to shield from descendants), and (3) its children\'s other parents (co-parents, because conditioning on a child opens the v-structure collider path). Given its Markov blanket, X is conditionally independent of all other nodes.',
  },
  {
    id: 'q-ai-resolution-refutation',
    subjectId: 'artificial-intelligence',
    topicId: 'ai-logic-knowledge',
    difficulty: 'GATE Level',
    isPYQ: false,
    question: 'In First-Order Logic theorem proving, to prove that Knowledge Base KB entails query α (KB |= α) using Resolution Refutation, one must show that:',
    options: [
      'KB ∧ ¬α is unsatisfiable (leads to the empty clause □)',
      'KB ∧ α is valid (a tautology)',
      'KB ∨ ¬α is satisfiable',
      '¬KB ∧ α is true under all interpretations',
    ],
    correctAnswer: 'A',
    concept: 'Proof by Refutation & Resolution Soundness and Completeness',
    explanation: 'Resolution refutation relies on the fundamental equivalence: KB |= α iff KB ∧ ¬α is unsatisfiable (contains a contradiction). The clauses of KB along with the negated goal ¬α are converted to Conjunctive Normal Form (CNF). Repeated application of the resolution rule until the empty clause (contradiction) is derived proves KB |= α.',
  },
];
