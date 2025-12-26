import { Router, Request, Response } from 'express';
import pool from '../../config/database';
import { formatResponse } from '../../utils/helpers';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/settings - Get all settings
router.get('/', async (req: Request, res: Response) => {
  try {
    const [settings] = await pool.execute('SELECT * FROM settings ORDER BY setting_key');

    const settingsObj: any = {};
    settings.forEach((setting: any) => {
      let value = setting.setting_value;
      if (setting.setting_type === 'number') {
        value = Number(value);
      } else if (setting.setting_type === 'boolean') {
        value = value === 'true' || value === '1';
      } else if (setting.setting_type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = setting.setting_value;
        }
      }
      settingsObj[setting.setting_key] = value;
    });

    res.json(formatResponse(true, settingsObj));
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

// PUT /api/admin/settings - Update settings
router.put('/', async (req: Request, res: Response) => {
  try {
    const settings = req.body;
    const adminId = (req as any).user?.userId;

    for (const [key, value] of Object.entries(settings)) {
      let settingType = 'string';
      let settingValue = String(value);

      if (typeof value === 'number') {
        settingType = 'number';
      } else if (typeof value === 'boolean') {
        settingType = 'boolean';
        settingValue = value ? 'true' : 'false';
      } else if (typeof value === 'object') {
        settingType = 'json';
        settingValue = JSON.stringify(value);
      }

      await pool.execute(
        `INSERT INTO settings (setting_key, setting_value, setting_type, updated_by)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           setting_value = VALUES(setting_value),
           setting_type = VALUES(setting_type),
           updated_by = VALUES(updated_by),
           updated_at = NOW()`,
        [key, settingValue, settingType, adminId]
      );
    }

    // Get updated settings
    const [updatedSettings] = await pool.execute('SELECT * FROM settings ORDER BY setting_key');
    const settingsObj: any = {};
    updatedSettings.forEach((setting: any) => {
      let value = setting.setting_value;
      if (setting.setting_type === 'number') {
        value = Number(value);
      } else if (setting.setting_type === 'boolean') {
        value = value === 'true' || value === '1';
      } else if (setting.setting_type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = setting.setting_value;
        }
      }
      settingsObj[setting.setting_key] = value;
    });

    res.json(formatResponse(true, settingsObj, 'Settings updated successfully'));
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json(formatResponse(false, undefined, undefined, error.message));
  }
});

export default router;

