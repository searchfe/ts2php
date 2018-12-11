export PATH=$NODEJS_BIN_LATEST:$PATH

echo "node: $(node -v)"
echo "npm: v$(npm -v)"

npm install

cp ./typescript.d.ts ./node_modules/typescript/lib/typescript.d.ts

npm run build
