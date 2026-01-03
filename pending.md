# Pending Cloud Implementation Tasks

This file lists features that need backend/cloud implementation by the developer (Aswd).

---

## ✅ VIP System - IMPLEMENTED

### Database
- ✅ `vips` table created with RLS policies
- ✅ `is_vip()` function created

### Admin Endpoints
- ✅ `POST /admin-actions/grant_vip` - Grant VIP status
- ✅ `POST /admin-actions/revoke_vip` - Remove VIP status
- ✅ `GET /admin-actions/vips` - List all VIPs

---

## ✅ Lock Site Feature - IMPLEMENTED

### Database
- ✅ `site_locks` table created with RLS policies
- ✅ Default 'global' row inserted

### Admin Endpoints
- ✅ `POST /admin-actions/lock_site` - Lock the site
- ✅ `POST /admin-actions/unlock_site` - Unlock the site
- ✅ `GET /admin-actions/site_lock_status` - Get lock status

---

## ✅ NAVI AI Bot - Live Announcements - IMPLEMENTED

### Database
- ✅ `navi_messages` table created with RLS policies

### Admin Endpoints
- ✅ `POST /admin-actions/navi_message` - Send NAVI message
- ✅ `GET /admin-actions/navi_messages` - Get NAVI message history

### UI (Previously Done)
- ✅ Bot badge added to Messages.tsx
- ✅ Badge hierarchy: Creator > Bot > Admin > VIP > User
- ✅ NAVI Message dialog in ModerationPanel

---

## Notes

- All VIP, Site Lock, and NAVI features now have full backend support
- VIP badges, popups, and priority indicators in UI can now use real data
- Frontend can be updated to call these endpoints instead of demo mode
