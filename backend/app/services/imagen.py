import base64
import io
import re
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def _parse_skills(bullets: list[str]) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {}
    for bullet in bullets:
        if ":" in bullet:
            label, items = bullet.split(":", 1)
            groups[label.strip()] = [s.strip() for s in items.split(",") if s.strip()]
    return groups


def generate_skills_chart(bullets: list[str]) -> str:
    """Returns base64-encoded PNG of skills grouped bar chart."""
    groups = _parse_skills(bullets)
    if not groups:
        return ""

    labels, counts, colors = [], [], []
    palette = ["#6366f1", "#0d9488", "#7c3aed", "#16a34a", "#d97706"]

    for i, (group, items) in enumerate(groups.items()):
        for item in items:
            labels.append(item)
            counts.append(len(groups) - i)          # visual weight by group
            colors.append(palette[i % len(palette)])

    fig, ax = plt.subplots(figsize=(7, max(3, len(labels) * 0.45)))
    bars = ax.barh(labels[::-1], counts[::-1], color=colors[::-1], height=0.55)
    ax.set_xlim(0, len(groups) + 1)
    ax.axis("off")
    ax.set_facecolor("#f0fdfa")
    fig.patch.set_facecolor("#f0fdfa")

    for bar, label in zip(bars, labels[::-1]):
        ax.text(
            0.15, bar.get_y() + bar.get_height() / 2,
            label, va="center", ha="left",
            fontsize=9, color="#1f2937",
        )

    plt.tight_layout(pad=0.4)
    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=120, bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")
