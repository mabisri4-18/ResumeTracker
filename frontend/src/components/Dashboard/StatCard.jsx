function StatCard({
  title,
  value,
  subtitle,
  description,
  icon,
  trend,
  trendType = "positive",
  variant = "primary",
}) {
  const cardDescription =
    subtitle || description || "";

  return (
    <article className={`stat-card stat-card-${variant}`}>

      {/* =========================================
          TOP ROW
      ========================================= */}

      <div className="stat-card-top">

        <div className="stat-icon">
          {icon}
        </div>

        {trend && (
          <span
            className={`stat-trend ${trendType}`}
          >
            {trend}
          </span>
        )}

      </div>


      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="stat-card-content">

        <p className="stat-title">
          {title}
        </p>

        <h3 className="stat-value">
          {value}
        </h3>

        {cardDescription && (
          <p className="stat-subtitle">
            {cardDescription}
          </p>
        )}

      </div>

    </article>
  );
}

export default StatCard;