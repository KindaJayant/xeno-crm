// client/src/pages/CampaignHistoryPage.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./CampaignHistoryPage.css";

// Force backend URL
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CampaignHistoryPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ctrlRef = useRef(null);

  const load = useCallback(async () => {
    // Cancel any in-flight request
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      setError("");
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/campaigns`, {
        signal: ctrl.signal,
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load campaign history");
      }
    } finally {
      if (ctrlRef.current === ctrl) ctrlRef.current = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    return () => ctrlRef.current?.abort();
  }, [load]);

  return (
    <div className="ccp hist">
      <h1 className="ccp__title">Campaign History</h1>
      <p className="ccp__subtitle">Review your previous campaigns and delivery stats.</p>

      <div className="ccp__card hist__card">
        <div className="hist__header">
          <div className="hist__left">
            <span className="hist__count">{campaigns.length}</span>
            <span className="hist__meta">campaigns</span>
          </div>
          <div className="ccp__actions">
            <button className="btn btn--ghost" onClick={load}>
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : error ? (
          <p className="ccp__error">{error}</p>
        ) : campaigns.length === 0 ? (
          <div className="hist__empty">
            <p>No campaigns found.</p>
          </div>
        ) : (
          <div className="hist__tableWrap">
            <table className="hist__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Audience</th>
                  <th>Sent</th>
                  <th>Failed</th>
                  <th>Conjunction</th>
                  <th>Rules</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => {
                  const created = c.createdAt
                    ? new Date(c.createdAt).toLocaleString(undefined, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-";

                  const rulesSummary = Array.isArray(c.rules)
                    ? c.rules.map((r) => `${r.field} ${r.operator} ${r.value}`).join(" | ")
                    : "";

                  return (
                    <tr key={c._id || i}>
                      <td>{i + 1}</td>
                      <td>{c.audienceSize ?? 0}</td>
                      <td><span className="pill pill--ok">{c?.stats?.sent ?? 0}</span></td>
                      <td><span className="pill pill--bad">{c?.stats?.failed ?? 0}</span></td>
                      <td>{(c.conjunction || "AND").toUpperCase()}</td>
                      <td>
                        <span title={rulesSummary}>
                          {rulesSummary || "—"}
                        </span>
                        {Array.isArray(c.rules) && c.rules.length > 0 && (
                          <details>
                            <summary>view</summary>
                            <pre>{JSON.stringify(c.rules, null, 2)}</pre>
                          </details>
                        )}
                      </td>
                      <td>{created}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
