import Foundation

@MainActor
final class AgentEventStore: ObservableObject {
    static let shared = AgentEventStore()

    @Published private(set) var events: [ControlAgentEvent] = []
    private let maxEvents = 400

    func append(_ event: ControlAgentEvent) {
        self.events.append(event)
        if self.events.count > maxEvents {
            self.events.removeFirst(self.events.count - maxEvents)
        }
    }

    func clear() {
        self.events.removeAll()
    }
}
