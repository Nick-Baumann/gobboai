import SwiftUI

struct TalkOverlayView: View {
    var controller: TalkOverlayController
    @State private var hovering = false

    var body: some View {
        ZStack(alignment: .topLeading) {
            TalkCloudView(phase: self.controller.model.phase, level: self.controller.model.level)
                .frame(width: 76, height: 64)
                .contentShape(Rectangle())
                .onTapGesture {
                    TalkModeController.shared.stopSpeaking(reason: .userTap)
                }
                .padding(8)

            Button {
                TalkModeController.shared.exitTalkMode()
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundStyle(Color.white.opacity(self.hovering ? 0.95 : 0.7))
                    .frame(width: 18, height: 18)
                    .background(Color.black.opacity(self.hovering ? 0.45 : 0.3))
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
            .contentShape(Circle())
            .padding(4)
            .onHover { self.hovering = $0 }
        }
        .frame(width: 92, height: 92, alignment: .center)
    }
}

private struct TalkCloudView: View {
    let phase: TalkModePhase
    let level: Double

    var body: some View {
        TimelineView(.animation) { context in
            let t = context.date.timeIntervalSinceReferenceDate
            let pulse = phase == .speaking ? (1 + 0.04 * sin(t * 6)) : 1
            let sink = phase == .thinking ? (3 + 2 * sin(t * 2)) : 0
            let listenScale = phase == .listening ? (1 + CGFloat(self.level) * 0.14) : 1
            let baseScale = phase == .thinking ? 0.94 : 1

            ZStack {
                CloudShape()
                    .fill(self.cloudGradient)
                    .overlay(
                        CloudShape()
                            .stroke(Color.white.opacity(0.35), lineWidth: 0.8))
                    .shadow(color: Color.black.opacity(0.18), radius: 8, x: 0, y: 4)
                    .scaleEffect(baseScale * pulse * listenScale)
                    .offset(y: sink)

                if phase == .listening {
                    Circle()
                        .stroke(self.ringGradient, lineWidth: 1)
                        .scaleEffect(1 + CGFloat(self.level) * 0.45)
                        .opacity(0.3 + CGFloat(self.level) * 0.4)
                        .animation(.easeOut(duration: 0.08), value: self.level)
                }

                if phase == .thinking {
                    TalkThinkingDots(time: t)
                        .offset(y: 18)
                }

                if phase == .speaking {
                    TalkSpeakingRings(time: t)
                }
            }
        }
    }

    private var cloudGradient: LinearGradient {
        LinearGradient(
            colors: [Color(red: 0.95, green: 0.98, blue: 1.0), Color(red: 0.75, green: 0.88, blue: 1.0)],
            startPoint: .topLeading,
            endPoint: .bottomTrailing)
    }

    private var ringGradient: LinearGradient {
        LinearGradient(
            colors: [Color.white.opacity(0.6), Color.white.opacity(0.1)],
            startPoint: .top,
            endPoint: .bottom)
    }
}

private struct TalkThinkingDots: View {
    let time: TimeInterval

    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<3, id: \.self) { idx in
                let phase = (time * 2 + Double(idx) * 0.45).truncatingRemainder(dividingBy: 1)
                Circle()
                    .fill(Color.white.opacity(0.75))
                    .frame(width: 5, height: 5)
                    .opacity(0.35 + 0.55 * phase)
            }
        }
    }
}

private struct TalkSpeakingRings: View {
    let time: TimeInterval

    var body: some View {
        ZStack {
            ForEach(0..<3, id: \.self) { idx in
                let phase = (time * 1.1 + Double(idx) / 3).truncatingRemainder(dividingBy: 1)
                Circle()
                    .stroke(Color.white.opacity(0.6 - phase * 0.5), lineWidth: 1)
                    .scaleEffect(0.8 + phase * 0.7)
                    .opacity(0.6 - phase * 0.6)
            }
        }
    }
}

private struct CloudShape: Shape {
    func path(in rect: CGRect) -> Path {
        let w = rect.width
        let h = rect.height
        let baseHeight = h * 0.44
        let baseRect = CGRect(x: rect.minX, y: rect.minY + h * 0.46, width: w, height: baseHeight)

        var path = Path()
        path.addRoundedRect(in: baseRect, cornerSize: CGSize(width: baseHeight / 2, height: baseHeight / 2))
        path.addEllipse(in: CGRect(x: rect.minX + w * 0.05, y: rect.minY + h * 0.28, width: w * 0.36, height: h * 0.36))
        path.addEllipse(in: CGRect(x: rect.minX + w * 0.28, y: rect.minY + h * 0.05, width: w * 0.44, height: h * 0.44))
        path.addEllipse(in: CGRect(x: rect.minX + w * 0.62, y: rect.minY + h * 0.3, width: w * 0.3, height: h * 0.3))
        return path
    }
}
