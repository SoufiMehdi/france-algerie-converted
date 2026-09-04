import CreateVoyageForm from './CreateVoyageForm'
import VoyageCard from './VoyageCard'

/**
 * Home page: lists all voyages.
 * Composes CreateVoyageForm (creation) and VoyageCard (display).
 */
export default function VoyageList({ voyages, onAdd, onRemove, onOpen }) {
  return (
    <div className="voyage-list">
      <CreateVoyageForm onAdd={onAdd} />

      {voyages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧳</div>
          <h3>Aucun voyage</h3>
          <p>Créez votre premier voyage pour commencer à ajouter des produits.</p>
        </div>
      ) : (
        <div className="voyages-grid">
          {voyages.map((v) => (
            <VoyageCard key={v.id} voyage={v} onOpen={onOpen} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  )
}
