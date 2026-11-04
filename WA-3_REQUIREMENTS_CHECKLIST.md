# WA-3 Requirements Checklist

## Assignment: React Frontend for Task Management API

### Explicit Requirements (from prompt)

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | React-based interface | ☐ | Screenshots of running app |
| 2 | React Router navigation | ☐ | Multiple routes working |
| 3 | At least 3 distinct routes/pages | ☐ | /, /tasks, /tasks/:id, /tasks/new, /tasks/:id/edit |
| 4 | Task list displaying real backend data | ☐ | Screenshot of task list |
| 5 | Individual task details page | ☐ | Screenshot of details page |
| 6 | Create task form | ☐ | Screenshot of create form |
| 7 | Edit task form | ☐ | Screenshot of edit form |
| 8 | Delete functionality | ☐ | Screenshot of delete confirmation |
| 9 | Real HTTP requests (no mock data) | ☐ | Network tab showing fetch calls |
| 10 | Form validation | ☐ | Error messages on empty/invalid input |
| 11 | Loading states | ☐ | Spinner visible during fetch |
| 12 | Error states | ☐ | Error message on failure |
| 13 | Empty states | ☐ | Message when no tasks |
| 14 | Responsive design (mobile + desktop) | ☐ | Screenshots at different widths |
| 15 | Accessible labels and keyboard-friendly controls | ☐ | Labels on form inputs |
| 16 | README documentation | ☐ | README.md in repo |
| 17 | Successful production build | ☐ | `npm run build` output |
| 18 | Public GitHub repository | ☐ | Repo URL accessible |

### Recommended Improvements (Optional)

| # | Improvement | Status |
|---|-------------|--------|
| 1 | Login/Register pages | ☐ |
| 2 | Logout functionality | ☐ |
| 3 | Token expiration handling | ☐ |
| 4 | Retry button on errors | ☐ |
| 5 | Confirmation dialog for delete | ☐ |
| 6 | CSS responsive breakpoints | ☐ |

### Verification Steps

1. [ ] Backend running on http://localhost:3000
2. [ ] Frontend running on http://localhost:5173
3. [ ] Can register a new user
4. [ ] Can login with credentials
5. [ ] Token saved in localStorage
6. [ ] Task list loads real data
7. [ ] Can view task details
8. [ ] Can create a task
9. [ ] Can edit a task
10. [ ] Can delete a task
11. [ ] Validation works (empty title → error)
12. [ ] Empty state shows when no tasks
13. [ ] Error state shows when backend is down
14. [ ] Mobile layout works (375px)
15. [ ] Desktop layout works (1440px)
16. [ ] `npm run build` succeeds
17. [ ] Git repo is public
18. [ ] .env is not in repo

### Submission

- [ ] Repository URL ready
- [ ] README complete
- [ ] Screenshots taken (if required)
- [ ] Submitted to internship portal
