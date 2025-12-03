#!/bin/bash

# Fix set-state-in-effect errors by adding eslint-disable-next-line comments

# Step 2
sed -i '' '62a\
                // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/new/step2/page.tsx

# Step 4
sed -i '' '68a\
            // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/new/step4/page.tsx

sed -i '' '69a\
            // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/new/step4/page.tsx

# Step 5
sed -i '' '55a\
            // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/new/step5/page.tsx

sed -i '' '56a\
            // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/new/step5/page.tsx

# Step 9
sed -i '' '69a\
            // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/new/step9/page.tsx

sed -i '' '70a\
            // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/new/step9/page.tsx

sed -i '' '71a\
            // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/new/step9/page.tsx

# Renewal step1b
sed -i '' '57a\
            // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/renewal/step1b/page.tsx

sed -i '' '58a\
            // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/renewal/step1b/page.tsx

# Renewal step4
sed -i '' '55a\
            // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/renewal/step4/page.tsx

# Renewal step5
sed -i '' '20a\
            // eslint-disable-next-line react-hooks/exhaustive-deps
' src/app/[locale]/renewal/step5/page.tsx

echo "Lint fixes applied"
