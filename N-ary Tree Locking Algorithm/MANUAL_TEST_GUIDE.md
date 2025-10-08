# 🧪 Manual Testing Guide - Lock/Unlock Verification

## Quick Visual Test (2 minutes)

### Your browser should now be open at: http://localhost:8080/demo

---

## ✅ Step-by-Step Verification

### Test 1: Basic Lock Operation 🔒

1. **Look at the tree** - You should see 8 nodes (Root, Child1-3, GC1-4)
2. **Click on "Child1"** (Node ID 1)
   - Node should get a blue border (selected)
   - Bottom should show "Selected Node: Node 1"
3. **Click the "Lock" button**
   - ✅ **Expected**: Node turns RED
   - ✅ **Expected**: Operation log shows green message: "Node Child1 locked by User 1"
   - ✅ **Expected**: "Locks" counter increases to 1

**Did it work?** → If Child1 turned red, ✅ LOCK WORKS!

---

### Test 2: Basic Unlock Operation 🔓

1. **Child1 should still be locked (red)** from Test 1
2. **Child1 should still be selected** (blue border)
3. **Click the "Unlock" button**
   - ✅ **Expected**: Node turns BLUE (back to free)
   - ✅ **Expected**: Operation log shows green message: "Node Child1 unlocked by User 1"
   - ✅ **Expected**: "Unlocks" counter increases to 1

**Did it work?** → If Child1 turned blue, ✅ UNLOCK WORKS!

---

### Test 3: Double Lock Prevention ❌🔒

1. **Click on "Child2"** (Node ID 2)
2. **Click "Lock"** - Child2 turns RED
3. **Keep Child2 selected** (it's still red)
4. **Click "Lock" AGAIN**
   - ✅ **Expected**: Nothing happens (stays red)
   - ✅ **Expected**: Operation log shows RED message: "Node Child2 is already locked by User 1"
   - ✅ **Expected**: Lock counter does NOT increase

**Did it work?** → If you got a red error message, ✅ DOUBLE LOCK PREVENTION WORKS!

---

### Test 4: Wrong User Unlock Prevention ❌🔓

1. **Child2 should still be locked** (red) from Test 3
2. **Change User ID** to **2** (in the User ID input box)
3. **With Child2 selected**, click "Unlock"
   - ✅ **Expected**: Node stays RED (still locked)
   - ✅ **Expected**: Operation log shows RED message: "...locked by User 1, not User 2"
   - ✅ **Expected**: Unlock counter does NOT increase

**Did it work?** → If you got a red error message, ✅ OWNERSHIP CHECK WORKS!

---

### Test 5: Ancestor Lock Constraint 🚫🔒

1. **Change User ID back to 1**
2. **Click on "Root"** (Node ID 0)
3. **Click "Lock"** - Root turns RED
4. **Click on "Child1"** (any child node)
5. **Click "Lock"**
   - ✅ **Expected**: Child1 stays BLUE (can't lock)
   - ✅ **Expected**: Operation log shows RED message: "has a locked ancestor"
   - ✅ **Expected**: Lock counter does NOT increase

**Did it work?** → If you got "locked ancestor" error, ✅ ANCESTOR CONSTRAINT WORKS!

---

### Test 6: Descendant Lock Constraint 🚫🔒

1. **Click "Reset" button** to clear all locks
2. **Click on "GC1"** (GrandChild1, Node ID 4)
3. **Click "Lock"** - GC1 turns RED
4. **Click on "Child1"** (parent of GC1, Node ID 1)
5. **Click "Lock"**
   - ✅ **Expected**: Child1 stays BLUE (can't lock)
   - ✅ **Expected**: Operation log shows RED message: "has 1 locked descendants"
   - ✅ **Expected**: Child1 shows yellow indicator "1 locked descendants"

**Did it work?** → If you got "locked descendants" error, ✅ DESCENDANT CONSTRAINT WORKS!

---

### Test 7: Upgrade Lock ⬆️🔒

1. **Click "Reset" button** to clear all locks
2. **Lock GC1** (Node 4) - turns RED
3. **Lock GC2** (Node 5) - turns RED
4. **Click on "Child1"** (parent of GC1 and GC2)
5. **Click "Upgrade Lock" button**
   - ✅ **Expected**: Child1 turns RED (now locked)
   - ✅ **Expected**: GC1 turns BLUE (unlocked)
   - ✅ **Expected**: GC2 turns BLUE (unlocked)
   - ✅ **Expected**: Operation log shows: "upgraded: unlocked 2 descendants, locked parent"
   - ✅ **Expected**: Upgrades counter increases to 1

**Did it work?** → If Child1 is red and grandchildren are blue, ✅ UPGRADE LOCK WORKS!

---

### Test 8: Automated Tests 🤖

1. **Click "Reset" button**
2. **Click "Run Automated Tests" button**
3. **Watch the magic!**
   - ✅ **Expected**: Nodes automatically lock/unlock
   - ✅ **Expected**: Operation log fills with green and red messages
   - ✅ **Expected**: Statistics update automatically
   - ✅ **Expected**: Takes about 2-3 seconds

**Did it work?** → If you saw automatic operations, ✅ AUTOMATED TESTS WORK!

---

### Test 9: Tree Builder 🌳

1. **Scroll down to "Tree Builder" section**
2. **Click on "Simple (3 nodes)" badge**
3. **Click "Build Tree" button**
   - ✅ **Expected**: Tree changes to only 3 nodes (Root, Left, Right)
   - ✅ **Expected**: All locks are reset
   - ✅ **Expected**: You can still lock/unlock the new nodes

**Did it work?** → If tree changed to 3 nodes, ✅ TREE BUILDER WORKS!

---

### Test 10: Code Viewer 📝

1. **Scroll down to "C++ Implementation" section**
2. **Click on different tabs** (Lock, Unlock, Upgrade, etc.)
   - ✅ **Expected**: Each tab shows different C++ code
   - ✅ **Expected**: Code is syntax-highlighted
   - ✅ **Expected**: Complexity badges shown (O(log N))

**Did it work?** → If you see different code in each tab, ✅ CODE VIEWER WORKS!

---

## 🎯 Final Verification Checklist

Check off each item as you verify:

- [ ] ✅ Lock makes nodes turn RED
- [ ] ✅ Unlock makes nodes turn BLUE
- [ ] ✅ Can't lock same node twice
- [ ] ✅ Can't unlock with wrong user
- [ ] ✅ Can't lock if ancestor is locked
- [ ] ✅ Can't lock if descendant is locked
- [ ] ✅ Siblings can lock independently
- [ ] ✅ Upgrade lock works (parent locks, children unlock)
- [ ] ✅ Automated tests run successfully
- [ ] ✅ Statistics update correctly
- [ ] ✅ Operation log shows all operations
- [ ] ✅ Tree Builder changes tree
- [ ] ✅ Code Viewer shows C++ code

---

## 📊 Expected Final State

After running all tests, you should see:

- **Locks Counter**: 10+ operations
- **Unlocks Counter**: 8+ operations
- **Upgrades Counter**: 1+ operations
- **Total Operations**: 20+ operations
- **Operation Log**: Multiple green and red messages
- **Tree**: Should be back to default or custom tree

---

## 🐛 If Something Doesn't Work

### Node doesn't change color when locked:
- Check browser console (F12) for errors
- Refresh the page (Ctrl+R)
- Check if Vite server is still running

### Operations don't appear in log:
- Scroll down in the operation log
- Check if you selected a node first
- Try clicking "Reset" and starting over

### Buttons don't respond:
- Make sure you selected a node (click on it)
- Check that User ID is set (default is 1)
- Refresh the page if needed

---

## ✅ Success Criteria

**ALL FEATURES WORKING** if:
- ✅ Nodes change color correctly (Blue ↔ Red)
- ✅ Operation log updates with each action
- ✅ Statistics counters increment
- ✅ Error messages show for invalid operations
- ✅ Constraints are enforced (ancestor/descendant)
- ✅ Automated tests run without errors

---

## 🎉 You're Done!

If all tests passed, **YOUR APPLICATION IS 100% FUNCTIONAL!** 🚀

The lock/unlock functionality is working perfectly with:
- ✅ Real-time visual feedback
- ✅ Constraint validation
- ✅ Operation logging
- ✅ Statistics tracking
- ✅ Multi-user support
- ✅ O(log N) performance

**Congratulations!** Your N-ary Tree Locking Algorithm is production-ready! 🎊
