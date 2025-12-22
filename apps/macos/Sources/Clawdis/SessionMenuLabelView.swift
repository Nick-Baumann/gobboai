import SwiftUI

struct SessionMenuLabelView: View {
    let row: SessionRow
    let width: CGFloat
    private let paddingLeading: CGFloat = 20
    private let paddingTrailing: CGFloat = 10

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            ContextUsageBar(
                usedTokens: row.tokens.total,
                contextTokens: row.tokens.contextTokens,
                width: max(1, self.width - (self.paddingLeading + self.paddingTrailing)),
                height: 4)

            HStack(alignment: .firstTextBaseline, spacing: 8) {
                Text(row.key)
                    .font(.caption.weight(row.key == "main" ? .semibold : .regular))
                    .lineLimit(1)
                    .truncationMode(.middle)
                    .layoutPriority(1)

                Spacer(minLength: 8)

                Text(row.tokens.contextSummaryShort)
                    .font(.caption.monospacedDigit())
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
                    .fixedSize(horizontal: true, vertical: false)
                    .layoutPriority(2)
            }
        }
        .padding(.vertical, 4)
        .padding(.leading, self.paddingLeading)
        .padding(.trailing, self.paddingTrailing)
    }
}
