function ProfileCard({ title, description, features }) {
  return (
    <article className="profile-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </article>
  )
}

export default ProfileCard
