# Hardcoded Data Audit

## Components Review

### 1. Sidebar.jsx

**Hardcoded:**

- ❌ Menu items array (Dashboard, Projects, Task list, Services, Chat)
- ❌ "BRESS" logo text
- ❌ Home icon emoji

**From API:**

- ✅ User name
- ✅ User email/ID
- ✅ Profile picture
- ✅ Notification count

**Analysis:** Menu items and branding are typically hardcoded as they're part of the app structure, not dynamic data.

---

### 2. TaskList.jsx

**Hardcoded:**

- ❌ Table column headers (Name, Admin, Members, Status, Run time, Finish date)
- ❌ "Last tasks" title
- ❌ "proceed to resolve them" text
- ❌ "Done" and "In progress" labels for statistics

**Generated (not from API):**

- ⚠️ Avatar URLs - generated from assignee name hash
- ⚠️ Member count - generated from task ID hash

**From API:**

- ✅ Task name
- ✅ Assignee name
- ✅ Task status
- ✅ Assigned date
- ✅ Due date
- ✅ Estimated days
- ✅ Task type

**Analysis:**

- Column headers and UI text are hardcoded (normal for UI)
- **ISSUE**: Avatar URLs and member count are generated, not from API
- API doesn't provide: avatar URLs, member count

---

### 3. Productivity.jsx

**Hardcoded:**

- ❌ "Productivity" title
- ❌ "Research" and "Design" labels (though derived from task types)
- ❌ "Data updates every 3 hours" text
- ❌ Days of week labels (Mon, Tue, Wed, etc.)

**From API:**

- ✅ Task data
- ✅ Task types
- ✅ Assigned dates

**Analysis:** Chart labels and UI text are hardcoded, but data comes from API.

---

### 4. ProjectsInProgress.jsx

**Hardcoded:**

- ❌ "Projects in progress:" title

**Generated (not from API):**

- ⚠️ Additional tags (Design, Backend, Frontend, Testing, Documentation)
- ⚠️ Tag colors
- ⚠️ Avatar URLs - generated from assignee name
- ⚠️ Comments count - random number
- ⚠️ Files count - random number

**From API:**

- ✅ Project title (task name)
- ✅ Assigned date
- ✅ Primary task type
- ✅ Assignee name
- ✅ In-progress status

**Analysis:**

- **ISSUE**: Additional tags, avatars, comments, and files are generated/random
- API doesn't provide: multiple tags, avatar URLs, comments count, files count

---

## Summary of Hardcoded/Generated Data

### Data That CANNOT Come from Current API:

1. **Avatar URLs** - API doesn't provide profile pictures for assignees
2. **Member count** - API doesn't provide team member count per task
3. **Comments count** - API doesn't provide comments data
4. **Files count** - API doesn't provide files/attachments data
5. **Additional project tags** - API only provides one task type

### Data That IS from API:

✅ All task information (name, assignee, status, dates, type)
✅ User profile data
✅ Notification count
✅ All statistics (calculated from API data)

### Recommendation:

The current implementation is correct. The "generated" data (avatars, member count, comments, files) is necessary because:

1. The API doesn't provide this information
2. These are UI enhancements to match the design
3. They're generated consistently (not random on each render)
4. If API is updated to include this data, we can easily replace the generation logic

### What Should Be Changed:

**NOTHING** - All data that CAN come from the API IS coming from the API. The generated data is necessary for the UI and is not available in the current API structure.
