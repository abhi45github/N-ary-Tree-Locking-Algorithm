# 🌳 N-ary Tree Locking Algorithm

A high-performance implementation of the N-ary tree locking algorithm with thread safety, optimized for concurrent access patterns found in database systems and file systems.

## 🚀 Quick Start

### Backend (C++ Implementation)
```bash
cd "N-ary Tree Locking Algorithm"
./tree_lock.exe
```

### Frontend (Interactive Demo)
```bash
cd nary-latch-main
npm install
npm run dev
# Opens at http://localhost:5173
```

## 📂 Project Structure

```
project_2/
├── N-ary Tree Locking Algorithm/     # C++ Backend Implementation
│   ├── main.cpp                      # Test suite and examples
│   ├── nary_tree_lock.cpp           # Core algorithm implementation
│   ├── nary_tree_lock.h             # Class definitions
│   └── tree_lock.exe                # Compiled executable
│
├── nary-latch-main/                  # React Frontend
│   ├── src/components/              # React components
│   ├── test-lock-unlock.html       # Standalone test page
│   └── package.json                # Node dependencies
│
└── INTERVIEW_COMPLETE_GUIDE.md      # Comprehensive interview preparation

```

## 🎯 Key Features

### Algorithm Capabilities
- **O(log n)** ancestor checking
- **O(1)** descendant checking with counter optimization
- **Thread-safe** operations with mutex protection
- **Memory-safe** with smart pointers (no memory leaks)
- **Scalable** to 10,000+ nodes

### Operations Supported
1. **Lock(X, uid)** - Lock node X for user uid
2. **Unlock(X, uid)** - Unlock node X by user uid
3. **UpgradeLock(X, uid)** - Upgrade from child locks to parent lock

### Locking Rules
- A node can be locked only if none of its ancestors or descendants are locked
- A node can be unlocked only by the user who locked it
- Upgrade lock requires all children to be locked by the same user

## 🛠️ Technology Stack

### Backend
- **C++17** - Modern C++ with STL
- **Smart Pointers** - Automatic memory management
- **Mutex** - Thread synchronization
- **CMake/Make** - Build system

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **D3.js** - Tree visualization
- **Vite** - Build tool
- **Tailwind CSS** - Styling

## 📊 Performance Metrics

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Lock | O(m + log n) | O(1) |
| Unlock | O(1) | O(1) |
| UpgradeLock | O(m) | O(1) |
| Tree Construction | O(n) | O(n) |

Where:
- n = total nodes in tree
- m = number of children
- log n = tree height

## 🧪 Testing

### Run All Tests
```bash
cd "N-ary Tree Locking Algorithm"
./tree_lock.exe
```

### Test Coverage
- ✅ Basic lock/unlock operations
- ✅ Ancestor-descendant conflict detection
- ✅ Upgrade lock functionality
- ✅ Edge cases (empty tree, invalid nodes)
- ✅ Concurrent access simulation
- ✅ Performance benchmarking (10,000 nodes)

## 💡 Real-World Applications

### File Systems
- Directory locking for concurrent access
- Preventing deletion of open files
- Hierarchical permission management

### Database Systems
- B-tree index locking
- Table and row-level locking
- Transaction isolation

### Distributed Systems
- Resource allocation
- Hierarchical access control
- Distributed lock management

## 📈 Benchmarks

| Metric | Value |
|--------|-------|
| Max Nodes Tested | 10,000 |
| Lock Operation | ~1ms |
| Unlock Operation | <0.1ms |
| Memory Usage | Linear O(n) |
| Thread Safety | Yes |

## 🖥️ Interactive Demo

The project includes a React-based visualization that allows you to:
- View tree structure interactively
- Lock/unlock nodes with visual feedback
- See real-time performance metrics
- Test API endpoints
- Export operation logs

## 🔧 Building from Source

### C++ Backend
```bash
# Using Make
make clean
make

# Using CMake
mkdir build
cd build
cmake ..
make

# Direct compilation
g++ -std=c++17 main.cpp nary_tree_lock.cpp -o tree_lock
```

### React Frontend
```bash
npm install
npm run dev     # Development
npm run build   # Production
```

## 📚 Documentation

- [Interview Guide](INTERVIEW_COMPLETE_GUIDE.md) - Complete Q&A for interviews
- [Project Summary](N-ary Tree Locking Algorithm/PROJECT_SUMMARY.md) - Technical overview
- [Testing Report](N-ary Tree Locking Algorithm/TESTING_REPORT.md) - Test results
- [Features](nary-latch-main/FEATURES.md) - Frontend features

## 🤝 Use Cases

1. **Version Control Systems** - Like Git's tree structure
2. **Cloud Storage** - Google Drive, Dropbox folder locking
3. **Operating Systems** - Process resource management
4. **Web Applications** - Session and resource management

## ⚡ Optimizations Implemented

1. **Descendant Counter** - O(1) descendant check instead of O(subtree_size)
2. **Hash Map Lookup** - O(1) node finding instead of O(n)
3. **Smart Pointers** - Automatic memory management
4. **Path Compression** - Optimized ancestor traversal

## 🎯 Why This Project?

This implementation demonstrates:
- **Algorithm Design** - Complex tree algorithms
- **Systems Programming** - Low-level C++ optimization
- **Concurrent Programming** - Thread safety and synchronization
- **Full Stack Development** - C++ backend + React frontend
- **Real-World Relevance** - Used in databases and file systems

## 📞 Contact & Repository

**GitHub**: [https://github.com/abhi45github/N-ary-Tree-Locking-Algorithm](https://github.com/abhi45github/N-ary-Tree-Locking-Algorithm)

---

Built with ❤️ for demonstrating advanced data structures and concurrent programming concepts.