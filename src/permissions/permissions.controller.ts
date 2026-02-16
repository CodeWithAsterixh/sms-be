import { Request, Response } from "express";
import pool from "../../lib/modules/helpers/db-connector";
import { throwError } from "../../lib/middlewares/error-handler";

export async function getAllPermissions(req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM permissions ORDER BY slug");
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    throwError(500, "Failed to fetch permissions");
  }
}

export async function getRolePermissions(req: Request, res: Response) {
  try {
    const { role } = req.params;
    const result = await pool.query(
      `SELECT p.slug 
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role = $1`,
      [role]
    );
    return res.json({ success: true, data: result.rows.map((r: any) => r.slug) });
  } catch (err) {
    throwError(500, "Failed to fetch role permissions");
  }
}

export async function updateRolePermissions(req: Request, res: Response) {
  const { role } = req.params;
  const { permissions } = req.body; // Array of slugs

  if (!Array.isArray(permissions)) {
    throwError(400, "Permissions must be an array of slugs");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Clear existing permissions for this role
    // First get permission IDs to keep
    // Wait, simpler approach: delete all for role, then re-insert.
    // Need to handle foreign key constraints if any? No, role_permissions is a join table.
    
    // Get IDs for slugs first to validate
    let permIds: number[] = [];
    if (permissions.length > 0) {
      // Create placeholders for the array: $1, $2, ...
      // Or use ANY($1)
      const permResult = await client.query(
        "SELECT id FROM permissions WHERE slug = ANY($1)",
        [permissions]
      );
      permIds = permResult.rows.map((r: any) => r.id);
    }

    // Delete existing
    await client.query("DELETE FROM role_permissions WHERE role = $1", [role]);

    // Insert new
    for (const id of permIds) {
      await client.query(
        "INSERT INTO role_permissions (role, permission_id) VALUES ($1, $2)",
        [role, id]
      );
    }

    await client.query("COMMIT");
    return res.json({ success: true, message: "Permissions updated successfully" });
  } catch (err: any) {
    await client.query("ROLLBACK");
    if (err.statusCode) throw err;
    throwError(500, err.message || "Failed to update permissions");
  } finally {
    client.release();
  }
}
