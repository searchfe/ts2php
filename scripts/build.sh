export PATH=$NODEJS_BIN_LATEST:$PATH

echo "node: $(node -v)"
echo "npm: v$(npm -v)"

npm install

cp ./typescript.d.ts ./node_modules/typescript/lib/typescript.d.ts

npm install @types/lodash @types/node

npm run build


mkdir output
mv ./dist ./output/dist
mv ./demo ./output/demo
mv ./package.json ./output/package.json
