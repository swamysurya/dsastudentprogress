import { ModuleInfo, Question } from '../types';

export const MODULES: ModuleInfo[] = [
  {
    id: 'stack-queue',
    title: 'Stacks & Queues',
    description: 'Implementations, Next Greater Element, Infix/Postfix notations, Monotonic Stacks & Simulations',
    order: 1,
    iconName: 'Layers'
  },
  {
    id: 'binary-trees',
    title: 'Binary Trees',
    description: 'Traversals, Properties, Diameter, Views, LCA, Construction & Multi-level Practice Sets',
    order: 2,
    iconName: 'GitFork'
  },
  {
    id: 'bst',
    title: 'Binary Search Tree (BST)',
    description: 'Search, Insertion, Deletion, Validation, Predecessor/Successor & Median Queries',
    order: 3,
    iconName: 'Binary'
  },
  {
    id: 'heaps',
    title: 'Heaps & Priority Queue',
    description: 'Heapify, Convert Max to Min, Top K Frequent, Merge K Sorted & Stream Medians',
    order: 4,
    iconName: 'Boxes'
  },
  {
    id: 'two-pointers-window',
    title: 'Hashing, Sliding Window & Two Pointers',
    description: 'Prefix Sums, Subarrays with Sum K, Two/Three/Four Sum, Dynamic Windows & Multi-stream Queries',
    order: 5,
    iconName: 'Sliders'
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    description: 'Singly, Doubly, Circular, Cycle Detection, Add Numbers, Flattening, Sorting & LRU Cache',
    order: 6,
    iconName: 'Link'
  }
];

export const RAW_QUESTIONS: Question[] = [
  // ==========================================
  // MODULE 1: Stacks & Queues
  // ==========================================
  {
    id: 'sq-1',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Stack Implementation using Arrays',
    title: 'Stack Implementation using Arrays',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sq-2',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Next Greater Element',
    title: 'Next Greater Element',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'sq-3',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Next Greater Element',
    title: 'Next Greater Element Lookup',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'sq-4',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Next Greater Element',
    title: 'Next Greater Element II',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'sq-5',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Next Greater Element',
    title: 'Nearest Smaller Element',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'sq-6',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Next Greater Element',
    title: 'Next Warmer Day Forecast',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'sq-7',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Next Greater Element',
    title: 'Find Towers Facing Sea',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'sq-8',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Infix, Prefix, and Postfix Notations',
    title: 'Convert Infix to Postfix',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'sq-9',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Infix, Prefix, and Postfix Notations',
    title: 'Convert Infix to Prefix',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-10',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Infix, Prefix, and Postfix Notations',
    title: 'Convert Postfix to Infix',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-11',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Infix, Prefix, and Postfix Notations',
    title: 'Convert Postfix to Prefix',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-12',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Infix, Prefix, and Postfix Notations',
    title: 'Convert Prefix to Infix',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-13',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Infix, Prefix, and Postfix Notations',
    title: 'Convert Prefix to Postfix',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-14',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Implement Min Stack',
    title: 'Implement Min Stack',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sq-15',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Balanced Parentheses',
    title: 'Balanced Parenthesis',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sq-16',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Balanced Parentheses',
    title: 'Balanced Parentheses with Locked Characters',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-17',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Balanced Parentheses',
    title: 'Minimum Removal for Valid Parentheses',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-18',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Asteroid Collision',
    title: 'Asteroid Collision',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sq-19',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Asteroid Collision',
    title: 'The Luminary at the Conference',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-20',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Asteroid Collision',
    title: 'Consecutive Letter Block Removal',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-21',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Asteroid Collision',
    title: 'Restrictive Candy Crush',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-22',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Largest Rectangle in Histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sq-23',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Largest Rectangle in Histogram',
    title: 'Maximal Unity Rectangle Discovery',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-24',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Largest Rectangle in Histogram',
    title: 'Sum of Min Subarray Elements',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-25',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Queue - Introduction & Implementation',
    title: 'Queue Implementation Using Arrays',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sq-26',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Queue Implementation Using Linked List',
    title: 'Queue Implementation Using Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sq-27',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Implement Stack Using Queue',
    title: 'Implement Stack Using Queue',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sq-28',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Implement Queue Using Stack',
    title: 'Implement Queue Using Stack',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  // Stack & Queue Practice Sets
  {
    id: 'sq-29',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Stack & Queue Simulation - Practice Set',
    title: 'Delete Middle Element of stack',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-30',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Stack & Queue Simulation - Practice Set',
    title: 'Queue Reversal',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-31',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Stack & Queue Simulation - Practice Set',
    title: 'Stack Sort - Descending Order',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-32',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Stack & Queue Simulation - Practice Set',
    title: 'Evaluate Reverse Task Sequence',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-33',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Stack & Queue Simulation - Practice Set',
    title: 'Canonical Path Simplifier',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-34',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Stack & Queue Simulation - Practice Set',
    title: 'Unraveling Encoded Sequences',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-35',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Stack & Queue Simulation - Practice Set',
    title: 'Basic Calculator',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-36',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Stack & Queue Simulation - Practice Set',
    title: 'Stamping a Pattern on a Template',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-37',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Stack & Queue Simulation - Practice Set',
    title: 'Students Passing Through a Turnstile',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-38',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Monotonic Stack - Practice Set',
    title: 'Stock Span',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-39',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Monotonic Stack - Practice Set',
    title: 'Next Greater Permutation of a Number',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-40',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Monotonic Stack - Practice Set',
    title: 'Summing Ranges within Subarrays',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-41',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Monotonic Stack - Practice Set',
    title: 'Remove K Digits',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-42',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Monotonic Stack - Practice Set',
    title: 'First Negative Number in Every Subarray of Size m',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-43',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Monotonic Stack - Practice Set',
    title: 'Smart Bookshelf',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sq-44',
    moduleId: 'stack-queue',
    moduleTitle: 'Stacks & Queues',
    topic: 'Monotonic Stack - Practice Set',
    title: 'Visible People in a Line of People',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },

  // ==========================================
  // MODULE 2: Binary Trees
  // ==========================================
  {
    id: 'bt-1',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree Traversal',
    title: 'Binary Tree Representation',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'bt-2',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Pre Order Traversal',
    title: 'Pre Order Traversal',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'bt-3',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'In Order Traversal',
    title: 'In Order Traversal',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'bt-4',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Post Order Traversal',
    title: 'Post Order Traversal',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'bt-5',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Level Order Traversal',
    title: 'Level Order Traversal',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'bt-6',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Level Order Traversal',
    title: 'Zig-Zag Level Order Traversal',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'bt-7',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Height of a Binary Tree',
    title: 'Height of a Binary Tree',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'bt-8',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Height of a Binary Tree',
    title: 'Shortest Path to a Leaf in a Binary Tree',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'bt-9',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Height of a Binary Tree',
    title: 'Total Number of Family Members',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'bt-10',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Balanced Binary Tree',
    title: 'Balanced Binary Tree',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'bt-11',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Balanced Binary Tree',
    title: 'Identical Binary Trees',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'bt-12',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Balanced Binary Tree',
    title: 'Comparing Leaf Sequences of Binary Trees',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'bt-13',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Balanced Binary Tree',
    title: 'Mirroring a Binary Tree',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'bt-14',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Diameter Of Binary Tree',
    title: 'Diameter Of Binary Tree',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'bt-15',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Maximum Path Sum of Binary Tree',
    title: 'Maximum Path Sum of Binary Tree',
    difficulty: 'Hard',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'bt-16',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Top View of Binary Tree',
    title: 'Top View of Binary Tree',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'bt-17',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Top View of Binary Tree',
    title: 'Bottom View of Binary Tree',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'bt-18',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Right View of Binary Tree',
    title: 'Left View of Binary Tree',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: true
  },
  {
    id: 'bt-19',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Right View of Binary Tree',
    title: 'Right View of Binary Tree',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'bt-20',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Lowest Common Ancestor of a Binary Tree',
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: true
  },
  // BT Practice Sets
  {
    id: 'bt-21',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Easy Practice Set',
    title: 'Symmetric Binary Tree',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'bt-22',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Easy Practice Set',
    title: 'Binary Tree Paths',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: true
  },
  {
    id: 'bt-23',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Easy Practice Set',
    title: 'Product of Right Leaves',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-24',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Easy Practice Set',
    title: 'Check Subtree in a Binary Tree',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-25',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Easy Practice Set',
    title: 'Unique Tree from Traversals',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-26',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Medium Practice Set',
    title: 'Vertical Order Traversal of Binary Tree',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-27',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Medium Practice Set',
    title: 'Children Sum Property In Binary Tree',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-28',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Medium Practice Set',
    title: 'Inorder Postorder Tree Build',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-29',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Medium Practice Set',
    title: 'Connect Next Right Pointers in Binary Tree',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-30',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Medium Practice Set',
    title: 'All Nodes Distance X in Binary Tree',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-31',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Medium Practice Set',
    title: 'Maximum Width of a Binary Tree',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-32',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Hard Practice Set',
    title: 'Tree Serialization and Deserialization',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-33',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Hard Practice Set',
    title: 'Boundary Traversal of Binary Tree',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-34',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Hard Practice Set',
    title: 'Reconstruct Binary Tree from Preorder String',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-35',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Hard Practice Set',
    title: 'Reversible Range XOR',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-36',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Hard Practice Set',
    title: 'Encode and Decode N-ary Tree to Binary Tree',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bt-37',
    moduleId: 'binary-trees',
    moduleTitle: 'Binary Trees',
    topic: 'Binary Tree - Hard Practice Set',
    title: 'Count Leaders in the Organization',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },

  // ==========================================
  // MODULE 3: Binary Search Tree - BST
  // ==========================================
  {
    id: 'bst-1',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'Introduction to Binary Search Tree',
    title: 'Search in Binary Search Tree',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'bst-2',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'Insertion in Binary Search Tree',
    title: 'Insertion in Binary Search Tree',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'bst-3',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'Deletion in Binary Search Tree',
    title: 'Deletion in Binary Search Tree',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'bst-4',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'Kth Smallest Element in BST',
    title: 'Kth Smallest Element in BST',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'bst-5',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'Validate BST',
    title: 'Validate BST',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'bst-6',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'Predecessor and Successor in BST',
    title: 'Predecessor in BST',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'bst-7',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'Predecessor and Successor in BST',
    title: 'Successor in BST',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'bst-8',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'Predecessor and Successor in BST',
    title: 'Merge Two BST',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'bst-9',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'BST Practice Set',
    title: 'Lowest Common Ancestor in BST',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bst-10',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'BST Practice Set',
    title: 'K Closest Nodes in BST',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bst-11',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'BST Practice Set',
    title: 'Reconstruct Zone Tree from Preorder',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bst-12',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'BST Practice Set',
    title: 'Next Larger Value in a Binary Search Tree',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bst-13',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'BST Practice Set',
    title: 'Next Smaller Value in a Binary Search Tree',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'bst-14',
    moduleId: 'bst',
    moduleTitle: 'Binary Search Tree (BST)',
    topic: 'BST Practice Set',
    title: 'Binary Layer Median',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },

  // ==========================================
  // MODULE 4: Heaps / Priority Queue
  // ==========================================
  {
    id: 'hp-1',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Max Heap Validation',
    title: 'Max Heap Validation',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'hp-2',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Convert Max Heap to Min Heap',
    title: 'Convert Max Heap to Min Heap',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'hp-3',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Kth Largest Element in Array',
    title: 'Kth Largest Element in Array',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'hp-4',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Merge K Sorted Array',
    title: 'Merge K sorted Arrays',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'hp-5',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Top K Frequent Element',
    title: 'Top K frequent Element',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'hp-6',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Fundamentals - Practice Set',
    title: 'Implement Min Heap',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-7',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Fundamentals - Practice Set',
    title: 'Implement Max Heap',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-8',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Fundamentals - Practice Set',
    title: 'Build Heap from Array',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-9',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Fundamentals - Practice Set',
    title: 'Heapify Algorithm',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-10',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Fundamentals - Practice Set',
    title: 'Heap Sort',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-11',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Fundamentals - Practice Set',
    title: 'Replace Elements with Their Ranks',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-12',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Applications - Practice Set',
    title: 'Minimum Cost To Join Rods',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-13',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Applications - Practice Set',
    title: 'Maximum K Pairs Sum',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-14',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Applications - Practice Set',
    title: 'Stacking Books in Shelves',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-15',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Applications - Practice Set',
    title: 'Tasks Scheduling',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-16',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Applications - Practice Set',
    title: 'Leaderboard in an Online Game',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-17',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Applications - Practice Set',
    title: 'Median Tracker In Data Stream',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-18',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Applications - Practice Set',
    title: 'Innovative Ventures',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'hp-19',
    moduleId: 'heaps',
    moduleTitle: 'Heaps & Priority Queue',
    topic: 'Heap Applications - Practice Set',
    title: 'Count Strong Middle Positions',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },

  // ==========================================
  // MODULE 5: Hashing, Sliding Window & Two Pointers
  // ==========================================
  {
    id: 'sw-1',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Hashing',
    title: 'Most Frequent Element',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sw-2',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Hashing',
    title: 'Half Pair Check',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-3',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Hashing',
    title: 'Pattern Word Matching with Bijection',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-4',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Hashing',
    title: 'Relative Order Sort',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-5',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Hashing',
    title: 'Minimum Number of Balls in the Box',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-6',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Prefix Sum',
    title: 'Prefix Sum Array',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sw-7',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Prefix Sum',
    title: 'Book Title Prefixes',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-8',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Prefix Sum',
    title: 'Scoreboard After Each Round',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-9',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Prefix Sum',
    title: 'Maximum Sum After One Skip',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-10',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Prefix Sum',
    title: 'Largest Subarray With Zero Sum',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-11',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window and Two Pointers',
    title: 'Maximum Sum Fixed Window',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sw-12',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window and Two Pointers',
    title: 'Union of Two Sorted Arrays',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-13',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window and Two Pointers',
    title: 'Count Good Subarrays',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-14',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window and Two Pointers',
    title: 'Substrings with All Three Characters',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-15',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Longest Subarray with Sum K',
    title: 'Longest Sub-Array with Sum K',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sw-16',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Longest Subarray with Sum K',
    title: 'Shortest Subarray with Sum k',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-17',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Longest Subarray with Sum K',
    title: 'Find Stable Position in Array',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-18',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Longest Subarray with Sum K',
    title: 'Continuous Subarray Sum',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-19',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Longest Subarray with Sum K',
    title: 'Subarray Product Below K',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-20',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Largest Subarray Sum',
    title: 'Largest Subarray Sum',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sw-21',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Largest Subarray Sum',
    title: 'Max Pair Sum in Subarrays',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-22',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Largest Subarray Sum',
    title: 'Maximum Subarray Product',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-23',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Largest Subarray Sum',
    title: 'Maximum Subarray After Operations',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-24',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Largest Subarray Sum',
    title: 'Maximum Sum in Circular Sensor Data',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-25',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Two Sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'sw-26',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Two Sum',
    title: 'Two Sum II',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-27',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Two Sum',
    title: 'Three Sum',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-28',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Two Sum',
    title: 'Four Sum',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-29',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Two Sum',
    title: 'Count Subarrays with Target Sum',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-30',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Two Sum',
    title: 'Count Valid Triplets',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-31',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Medium Practice Set',
    title: 'Repeat-Bounded Window',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-32',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Medium Practice Set',
    title: 'Streak Length Mode',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-33',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Medium Practice Set',
    title: 'Sliding Window Sort Fix',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-34',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Medium Practice Set',
    title: 'Sliding Window Mode Sum',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-35',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Medium Practice Set',
    title: 'Windowed Rate Compliance',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-36',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Medium Practice Set',
    title: 'Maximum Aligned Prefix',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-37',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Medium Practice Set',
    title: 'Interval Bridge Minimization',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-38',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Medium Practice Set',
    title: 'Count Unique Visitor Segments',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-39',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Medium Practice Set',
    title: 'Steady Step Segment Sum',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-40',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Hard Practice Set',
    title: 'Find Starting Indices of Concatenated Phrases',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-41',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Hard Practice Set',
    title: 'Smallest Interval Covering Elements from K Streams',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-42',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Hard Practice Set',
    title: 'Maximum Symmetric Substring Split',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-43',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Hard Practice Set',
    title: 'Max Points Reachable in Grid Queries',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-44',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Hard Practice Set',
    title: 'Shortest Substring Containing Subsequence',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-45',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Hard Practice Set',
    title: 'Network Signal Monitoring',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-46',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Hard Practice Set',
    title: 'Lexicographic Split Fragment',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-47',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Hard Practice Set',
    title: 'Uniform Beat Window',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-48',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Hard Practice Set',
    title: 'Threshold Frequency Substrings',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'sw-49',
    moduleId: 'two-pointers-window',
    moduleTitle: 'Hashing, Sliding Window & Two Pointers',
    topic: 'Sliding Window & Two Pointer - Hard Practice Set',
    title: 'Maximum Power Score of a Fixed Segment',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },

  // ==========================================
  // MODULE 6: Linked List
  // ==========================================
  {
    id: 'll-1',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Introduction to LinkedList',
    title: 'Convert Array To Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-2',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Introduction to LinkedList',
    title: 'Linked List Traversal',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-3',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Introduction to LinkedList',
    title: 'Length of Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-4',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Introduction to LinkedList',
    title: 'Search In Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-5',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Insertion in LinkedList',
    title: 'Insertion At Head - Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-6',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Insertion in LinkedList',
    title: 'Insertion At Tail - Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-7',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Insertion in LinkedList',
    title: 'Insertion At Kth Position - Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-8',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Insertion in LinkedList',
    title: 'Insertion Before a Node With Value X - Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-9',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Deletion in LinkedList',
    title: 'Delete Head of the Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-10',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Deletion in LinkedList',
    title: 'Delete Tail of the Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-11',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Deletion in LinkedList',
    title: 'Delete Kth Node of the Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-12',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Deletion in LinkedList',
    title: 'Delete Node With Value X - Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-13',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Deletion in LinkedList',
    title: 'Filter Linked List Nodes by Array',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-14',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Doubly Linked List',
    title: 'Convert Array To Doubly Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-15',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Doubly Linked List',
    title: 'Convert Doubly Linked List to Array',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-16',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Insertion in Doubly Linked List',
    title: 'Insertion At Head - Doubly Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-17',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Insertion in Doubly Linked List',
    title: 'Insertion At Tail - Doubly Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-18',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Insertion in Doubly Linked List',
    title: 'Insert Before Kth Node - Doubly Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-19',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Deletion in Doubly Linked List',
    title: 'Deletion At Head - Doubly Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-20',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Deletion in Doubly Linked List',
    title: 'Deletion At Tail - Doubly Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-21',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Deletion in Doubly Linked List',
    title: 'Delete Before Kth Node - Doubly Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-22',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Circular Linked List',
    title: 'Verify if a Linked List Forms a Circle',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-23',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Circular Linked List',
    title: 'Circular Linked List Traversal',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-24',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Circular Linked List',
    title: 'Create a Circular LL from Singly LL',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-25',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Reverse Linked List',
    title: 'Reverse a Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-26',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Reverse Linked List',
    title: 'Reverse Linked List II',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-27',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Cycle Detection in LL',
    title: 'Cycle Detection',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-28',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Cycle Detection in LL',
    title: 'Cycle Detection In Linked List II',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-29',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Length of Cycle',
    title: 'Length of Cycle',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-30',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Adding Two Numbers',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-31',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Adding Two Numbers',
    title: 'Adding N Numbers',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-32',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Adding Two Numbers',
    title: 'Adding Two Number II',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-33',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Merge Two Sorted Linked List',
    title: 'Merge Two Sorted Linked Lists',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-34',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Intersection of Two Linked List',
    title: 'Intersection of Two Linked List',
    difficulty: 'Easy',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-35',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Flatten Linked List',
    title: 'Flatten a Linked List',
    difficulty: 'Medium',
    lectureVideo: true,
    isDoneDefault: false
  },
  {
    id: 'll-36',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Flatten Linked List',
    title: 'Flatten Multilevel Doubly Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  // LL Practice Sets
  {
    id: 'll-37',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Middle of the Linked List',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-38',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Kth Node From Middle in Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-39',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Delete the Middle of the Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-40',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Delete Kth Node from Middle in Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-41',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Delete Kth Node From End in a Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-42',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Skip and Delete in Linked List',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-43',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Swapping Nodes in a Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-44',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Even and Odd Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-45',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Palindrome Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-46',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Reverse a Doubly Linked List',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-47',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Removing Duplicates From A Sorted DLL',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-48',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Remove Duplicates From Sorted Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-49',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Add 1 to linked list',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-50',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Traversal & Basics - Practice Set',
    title: 'Double the Linked List Number',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-51',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Remove Nodes From Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-52',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Rotate the Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-53',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Find Start Node of a Cycle in Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-54',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Finding Pairs with Given Sum in a DLL',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-55',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Find Triplets with Target Sum in a DLL',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-56',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Find Quadruplets with Target Sum in a DLL',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-57',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Find Pairs with Given Product in a Sorted DLL',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-58',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Sort Linked List',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-59',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Linked List Insertion Sort',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-60',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Linked List Partitioning',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-61',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: "Sort a LinkedList of 0's, 1's, and 2's",
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-62',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Reverse Nodes in K-Group',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-63',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Reverse Nodes in Odd-Length Groups',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-64',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Selective Group Reversal in DLL',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-65',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'Merge K Sorted Linked Lists',
    difficulty: 'Hard',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-66',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Linked List Restructuring & Sorting - Practice Set',
    title: 'LRU Cache',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-67',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Circular Linked List - Practice Set',
    title: 'Sorted Merge of Circular DLL',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-68',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Circular Linked List - Practice Set',
    title: 'Split a CLL into Two Balanced Lists',
    difficulty: 'Easy',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-69',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Circular Linked List - Practice Set',
    title: 'Divide a Circular Train Route',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  },
  {
    id: 'll-70',
    moduleId: 'linked-list',
    moduleTitle: 'Linked List',
    topic: 'Circular Linked List - Practice Set',
    title: 'Convert Doubly Linked List to Array I',
    difficulty: 'Medium',
    lectureVideo: false,
    isDoneDefault: false
  }
];
