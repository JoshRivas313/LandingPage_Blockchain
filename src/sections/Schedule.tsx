import { SCHEDULE, SLOT_ICON } from "@/data/schedule"

export function Schedule() {
  return (
    <section className="bc-schedule" id="cronograma">
      <div className="bc-schedule__wrap">
        <div className="bc-schedule__head" data-reveal>
          <h2>Un día entero de blockchain</h2>
          <p>De la teoría a la práctica, hora por hora.</p>
          <span className="bc-schedule__venue">📍 Auditorio UTP Sede Central</span>
        </div>

        <div className="bc-timeline" data-reveal="line" />
        <div className="bc-timeline">
          {SCHEDULE.map((slot) => (
            <div className="bc-timeline__row" key={slot.time} data-reveal data-stagger>
              <div
                className={`bc-slot${slot.type ? " bc-slot--hl" : ""}${
                  slot.title === "Proximamente revelado" ? " bc-slot--soon" : ""
                }`}
              >
                <span className="bc-slot__time">{slot.time}</span>
                <h4 className="bc-slot__title">
                  {slot.type ? SLOT_ICON[slot.type] : ""}
                  {slot.title}
                </h4>
                {slot.speaker && (
                  <div className="bc-slot__who">
                    <span className="bc-slot__speaker">👤 {slot.speaker}</span>
                    {slot.community && (
                      <span className="bc-slot__community">— {slot.community}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
