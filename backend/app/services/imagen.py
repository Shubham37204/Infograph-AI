import base64
import io
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
    """Returns base64-encoded PNG — compact grouped bar chart."""
    groups = _parse_skills(bullets)
    if not groups:
        return ""

    labels  = list(groups.keys())
    counts  = [len(items) for items in groups.values()]
    palette = ["#6366f1", "#0d9488", "#7c3aed", "#16a34a", "#d97706"]
    colors  = [palette[i % len(palette)] for i in range(len(labels))]

    fig, ax = plt.subplots(figsize=(6, max(1.8, len(labels) * 0.7)))
    fig.patch.set_facecolor("#f0fdfa")
    ax.set_facecolor("#f0fdfa")

    bars = ax.barh(labels[::-1], counts[::-1], color=colors[::-1], height=0.5)

    for bar, count in zip(bars, counts[::-1]):
        ax.text(
            bar.get_width() + 0.15,
            bar.get_y() + bar.get_height() / 2,
            f"{count} skills",
            va="center", ha="left",
            fontsize=9, color="#374151",
        )

    ax.set_xlim(0, max(counts) + 3)
    ax.axis("off")
    plt.tight_layout(pad=0.5)

    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=120, bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")